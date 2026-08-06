"use client";

import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { createPosition } from "@/actions/admin/organization";

interface Position {
  id: string;
  nameEn: string;
  nameGu: string;
  priority: number;
  _count: { officeBearers: number };
}

export default function PositionsClient({ initialPositions }: { initialPositions: Position[] }) {
  const [positions, setPositions] = useState(initialPositions);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nameEn: "",
    nameGu: "",
    priority: 0
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newPos = await createPosition(formData);
      
      const completePos: Position = {
        id: newPos.id,
        nameEn: newPos.nameEn,
        nameGu: newPos.nameGu,
        priority: newPos.priority,
        _count: { officeBearers: 0 }
      };

      // Sort by priority after adding
      const newArray = [...positions, completePos].sort((a, b) => a.priority - b.priority);
      setPositions(newArray);
      
      setIsCreating(false);
      setFormData({ nameEn: "", nameGu: "", priority: 0 });
      toast.success("Position created successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to create position.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Positions Management</h1>
          <p className="text-slate-500">Manage official political titles (e.g. President, Secretary) available for assignment.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-primary text-slate-950 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> {isCreating ? "Cancel" : "Create Position"}
          </button>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-4 mb-6 border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg mb-2">Create New Position</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Title (English)</label>
              <input required placeholder="e.g. President" className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950" value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Title (Gujarati)</label>
              <input required placeholder="e.g. પ્રમુખ" className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950" value={formData.nameGu} onChange={e => setFormData({...formData, nameGu: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Priority (Lower = Higher Rank)</label>
              <input required type="number" min="0" placeholder="e.g. 1" className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950" value={formData.priority} onChange={e => setFormData({...formData, priority: parseInt(e.target.value) || 0})} />
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50">
            {isSubmitting ? "Creating..." : "Save Position"}
          </button>
        </form>
      )}

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search positions..." 
              className="w-full h-10 pl-9 pr-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4">Rank / Priority</th>
                <th className="p-4">Title</th>
                <th className="p-4">Assigned Bearers</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {positions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500">
                    No positions found. Create one to get started.
                  </td>
                </tr>
              ) : (
                positions.map((pos) => (
                  <tr key={pos.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="p-4">
                      <span className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-slate-600 dark:text-slate-300">
                        {pos.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{pos.nameEn}</p>
                      <p className="text-xs text-slate-500">{pos.nameGu}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary font-bold rounded-full text-xs">
                        {pos._count.officeBearers} Active
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
