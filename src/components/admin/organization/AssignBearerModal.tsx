"use client";

import { useState } from "react";
import { searchMembers } from "@/actions/admin/members";
import { assignOfficeBearer } from "@/actions/admin/organization";
import { toast } from "sonner";
import { Search, X, Check } from "lucide-react";

interface Position {
  id: string;
  nameEn: string;
  nameGu: string;
}

interface AssignBearerModalProps {
  unitId: string;
  positions: Position[];
  onClose: () => void;
  onSuccess: (newBearer: any) => void;
}

export default function AssignBearerModal({ unitId, positions, onClose, onSuccess }: AssignBearerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length < 3) return toast.error("Enter at least 3 characters");
    
    setIsSearching(true);
    try {
      const results = await searchMembers(searchQuery);
      setSearchResults(results);
    } catch (err) {
      toast.error("Failed to search members.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedMember || !selectedPosition) return toast.error("Select member and position");
    
    setIsSubmitting(true);
    try {
      const bearer = await assignOfficeBearer({
        memberId: selectedMember.id,
        positionId: selectedPosition,
        unitId
      });
      
      toast.success("Office Bearer assigned successfully!");
      onSuccess(bearer);
    } catch (err: any) {
      toast.error(err.message || "Assignment failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white dark:bg-slate-950 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-lg">Assign Office Bearer</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Step 1: Search Member */}
          {!selectedMember ? (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                1. Search for a Registered Member
              </label>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Name, Mobile, or ID Card Number..." 
                  className="flex-1 p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button type="submit" disabled={isSearching} className="px-4 bg-slate-200 dark:bg-slate-800 rounded-lg font-bold hover:bg-slate-300 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </form>

              <div className="space-y-2 mt-4">
                {searchResults.map(member => (
                  <div key={member.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg flex justify-between items-center bg-white dark:bg-slate-950 hover:border-primary cursor-pointer transition-colors" onClick={() => setSelectedMember(member)}>
                    <div>
                      <p className="font-bold text-sm">{member.user.name}</p>
                      <p className="text-xs text-slate-500">{member.memberId} • {member.mobile}</p>
                    </div>
                    <button className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded">Select</button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 flex justify-between items-center">
                <div>
                  <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Selected Member</p>
                  <p className="font-bold">{selectedMember.user.name}</p>
                  <p className="text-xs text-slate-600">{selectedMember.memberId}</p>
                </div>
                <button onClick={() => setSelectedMember(null)} className="text-xs font-bold text-slate-500 hover:underline">Change</button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  2. Select Position
                </label>
                <select 
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900"
                  value={selectedPosition}
                  onChange={e => setSelectedPosition(e.target.value)}
                >
                  <option value="">Select a political title...</option>
                  {positions.map(p => <option key={p.id} value={p.id}>{p.nameEn} ({p.nameGu})</option>)}
                </select>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 font-bold text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleAssign}
            disabled={!selectedMember || !selectedPosition || isSubmitting}
            className="px-5 py-2 font-bold bg-primary text-slate-950 rounded-lg disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            {isSubmitting ? "Saving..." : <><Check className="w-4 h-4"/> Confirm Assignment</>}
          </button>
        </div>

      </div>
    </div>
  );
}
