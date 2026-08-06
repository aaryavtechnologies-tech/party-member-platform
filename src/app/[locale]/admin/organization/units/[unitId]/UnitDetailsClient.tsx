"use client";

import { useState } from "react";
import { Plus, UserMinus, ShieldAlert } from "lucide-react";
import AssignBearerModal from "@/components/admin/organization/AssignBearerModal";
import { revokeOfficeBearer } from "@/actions/admin/organization";
import { toast } from "sonner";

export default function UnitDetailsClient({ unit, positions }: { unit: any, positions: any[] }) {
  const [isAssigning, setIsAssigning] = useState(false);
  const [bearers, setBearers] = useState(unit.officeBearers);

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this assignment?")) return;
    try {
      await revokeOfficeBearer(id, unit.id);
      setBearers(bearers.map((b: any) => b.id === id ? { ...b, status: "REVOKED" } : b));
      toast.success("Assignment revoked.");
    } catch (err: any) {
      toast.error(err.message || "Failed to revoke assignment");
    }
  };

  const activeBearers = bearers.filter((b: any) => b.status === "ACTIVE");
  const pastBearers = bearers.filter((b: any) => b.status !== "ACTIVE");

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{unit.nameEn}</h1>
          <p className="text-slate-500">{unit.level.nameEn} Level {unit.parent ? `• Child of ${unit.parent.nameEn}` : ""}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAssigning(true)}
            className="px-4 py-2 bg-primary text-slate-950 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Assign Office Bearer
          </button>
        </div>
      </div>

      {isAssigning && (
        <AssignBearerModal 
          unitId={unit.id}
          positions={positions}
          onClose={() => setIsAssigning(false)}
          onSuccess={(newBearer) => {
            // Optimistic update - requires full reload or state update
            window.location.reload();
          }}
        />
      )}

      {/* Active Office Bearers */}
      <h3 className="font-bold text-lg mt-6 mb-4">Active Office Bearers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeBearers.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500">
            No active office bearers assigned to this unit.
          </div>
        ) : (
          activeBearers.map((bearer: any) => (
            <div key={bearer.id} className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
              
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-slate-300">
                {bearer.member.user.name.charAt(0)}
              </div>
              
              <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{bearer.member.user.name}</h4>
              <p className="text-sm font-bold text-primary mb-2">{bearer.position.nameEn}</p>
              
              <p className="text-xs text-slate-500 mb-4">{bearer.member.mobile} • {bearer.member.memberId}</p>
              
              <button 
                onClick={() => handleRevoke(bearer.id)}
                className="w-full mt-auto py-2 flex items-center justify-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-xs font-bold rounded-lg transition-colors"
              >
                <UserMinus className="w-3 h-3" /> Revoke Assignment
              </button>
            </div>
          ))
        )}
      </div>

      {/* Past Bearers */}
      {pastBearers.length > 0 && (
        <>
          <h3 className="font-bold text-lg mt-12 mb-4 text-slate-500">Past Bearers (History)</h3>
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Position</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pastBearers.map((bearer: any) => (
                  <tr key={bearer.id} className="opacity-70">
                    <td className="p-4 font-medium">{bearer.member.user.name}</td>
                    <td className="p-4">{bearer.position.nameEn}</td>
                    <td className="p-4 text-xs font-mono">
                      {new Date(bearer.startDate).toLocaleDateString()} — {bearer.endDate ? new Date(bearer.endDate).toLocaleDateString() : "Now"}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {bearer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

    </>
  );
}
