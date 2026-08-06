"use client";

import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Edit, Settings } from "lucide-react";
import { toast } from "sonner";
import { createOrganizationUnit } from "@/actions/admin/organization";
import Link from "next/link";

interface Unit {
  id: string;
  nameEn: string;
  nameGu: string;
  parent: { nameEn: string } | null;
  _count: { officeBearers: number };
}

export default function OrganizationLevelClient({
  initialUnits,
  parentUnits,
  levelName,
  enumLevel
}: {
  initialUnits: Unit[];
  parentUnits: { id: string; nameEn: string }[];
  levelName: string;
  enumLevel: "NATIONAL" | "STATE" | "DISTRICT" | "TALUKA" | "VILLAGE";
}) {
  const [units, setUnits] = useState(initialUnits);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nameEn: "",
    nameGu: "",
    parentId: ""
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newUnit = await createOrganizationUnit({
        ...formData,
        levelName
      });
      
      const completeNewUnit: Unit = {
        id: newUnit.id,
        nameEn: newUnit.nameEn,
        nameGu: newUnit.nameGu,
        parent: parentUnits.find(p => p.id === newUnit.parentId) || null,
        _count: { officeBearers: 0 }
      };

      setUnits([completeNewUnit, ...units]);
      setIsCreating(false);
      setFormData({ nameEn: "", nameGu: "", parentId: "" });
      toast.success("Unit created successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to create unit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">{levelName} Management</h1>
          <p className="text-slate-500">Manage organizational units and leadership assignments at the {levelName} level.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/organization/positions">
            <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Settings className="w-4 h-4" /> Manage Positions
            </button>
          </Link>
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-primary text-slate-950 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> {isCreating ? "Cancel" : "Create Unit"}
          </button>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-4 mb-6 border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg mb-2">Create New {levelName.charAt(0).toUpperCase() + levelName.slice(1)} Unit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Unit Name (English)</label>
              <input required placeholder="e.g. Gujarat State Team" className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950" value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Unit Name (Gujarati)</label>
              <input required placeholder="e.g. ગુજરાત રાજ્ય સમિતિ" className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950" value={formData.nameGu} onChange={e => setFormData({...formData, nameGu: e.target.value})} />
            </div>
            
            {enumLevel !== "NATIONAL" && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Parent Unit</label>
                <select 
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950" 
                  value={formData.parentId} 
                  onChange={e => setFormData({...formData, parentId: e.target.value})}
                  required
                >
                  <option value="">Select Parent Unit...</option>
                  {parentUnits.map(p => <option key={p.id} value={p.id}>{p.nameEn}</option>)}
                </select>
              </div>
            )}
          </div>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50">
            {isSubmitting ? "Creating..." : "Save Unit"}
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
              placeholder={`Search ${levelName} units...`} 
              className="w-full h-10 pl-9 pr-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <button className="h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900 whitespace-nowrap">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4">Unit Name</th>
                {enumLevel !== "NATIONAL" && <th className="p-4">Parent Unit</th>}
                <th className="p-4">Active Leaders</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {units.length === 0 ? (
                <tr>
                  <td colSpan={enumLevel !== "NATIONAL" ? 5 : 4} className="p-12 text-center text-slate-500">
                    No units found at this level. Click "Create Unit" to get started.
                  </td>
                </tr>
              ) : (
                units.map((unit) => (
                  <tr key={unit.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                    <td className="p-4">
                      <Link href={`/admin/organization/units/${unit.id}`} className="hover:underline">
                        <p className="font-bold text-primary dark:text-primary-light text-sm">{unit.nameEn}</p>
                      </Link>
                      <p className="text-xs text-slate-500 font-mono">ID: {unit.id.substring(0,8)}</p>
                    </td>
                    {enumLevel !== "NATIONAL" && (
                      <td className="p-4 text-sm text-slate-700 dark:text-slate-300">
                        {unit.parent?.nameEn || "—"}
                      </td>
                    )}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {unit._count.officeBearers}
                        </span>
                        <span className="text-xs text-slate-500">Bearers</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                        Active
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/organization/units/${unit.id}`}>
                          <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors" title="Manage Assignments">
                            <Plus className="w-4 h-4" />
                          </button>
                        </Link>
                        <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors" title="Edit Unit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors" title="More Actions">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
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
