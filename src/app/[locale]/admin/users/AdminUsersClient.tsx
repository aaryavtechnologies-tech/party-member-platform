"use client";

import { useState } from "react";
import { AdminRole, Admin } from "@prisma/client";
import { toast } from "sonner";
import { createAdmin, deleteAdmin } from "@/actions/admin/users";
import { GUJARAT_DISTRICTS, getTalukasForDistrict } from "@/lib/gujarat-locations";

// Helper to determine allowed roles based on hierarchy
function getAllowedRoles(currentRole: AdminRole): AdminRole[] {
  switch(currentRole) {
    case "SUPER_ADMIN": return ["NATIONAL_ADMIN", "STATE_ADMIN", "DISTRICT_ADMIN", "TALUKA_ADMIN", "VILLAGE_ADMIN"];
    case "NATIONAL_ADMIN": return ["STATE_ADMIN", "DISTRICT_ADMIN", "TALUKA_ADMIN", "VILLAGE_ADMIN"];
    case "STATE_ADMIN": return ["DISTRICT_ADMIN", "TALUKA_ADMIN", "VILLAGE_ADMIN"];
    case "DISTRICT_ADMIN": return ["TALUKA_ADMIN", "VILLAGE_ADMIN"];
    case "TALUKA_ADMIN": return ["VILLAGE_ADMIN"];
    default: return [];
  }
}

export default function AdminUsersClient({ 
  initialAdmins, 
  currentRole,
  currentState,
  currentDistrict,
  currentTaluka
}: { 
  initialAdmins: Admin[], 
  currentRole: AdminRole,
  currentState?: string | null,
  currentDistrict?: string | null,
  currentTaluka?: string | null
}) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [isCreating, setIsCreating] = useState(false);
  const allowedRoles = getAllowedRoles(currentRole);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    username: "",
    passwordRaw: "",
    role: allowedRoles[0] || "VILLAGE_ADMIN",
    state: currentState || "",
    district: currentDistrict || "",
    taluka: currentTaluka || "",
    village: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAdmin = await createAdmin(formData as any);
      setAdmins([newAdmin as Admin, ...admins]);
      setIsCreating(false);
      toast.success("Admin created successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to create admin");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    try {
      await deleteAdmin(id);
      setAdmins(admins.filter(a => a.id !== id));
      toast.success("Admin deleted.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete admin");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Subordinate Admins</h2>
        {allowedRoles.length > 0 && (
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-primary text-slate-950 font-bold rounded-lg hover:bg-primary/90 transition"
          >
            {isCreating ? "Cancel" : "Create New Admin"}
          </button>
        )}
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Full Name" className="p-2 border rounded" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            <input required placeholder="Username" className="p-2 border rounded" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
            <input required type="email" placeholder="Email" className="p-2 border rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input required placeholder="Mobile" className="p-2 border rounded" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
            <input required type="password" placeholder="Password" className="p-2 border rounded" value={formData.passwordRaw} onChange={e => setFormData({...formData, passwordRaw: e.target.value})} />
            
            <select className="p-2 border rounded" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as AdminRole})}>
              {allowedRoles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            {/* Location Fields based on role hierarchy inheritance */}
            <input 
              placeholder="State" 
              className="p-2 border rounded" 
              value={formData.state} 
              disabled={!!currentState} 
              onChange={e => setFormData({...formData, state: e.target.value})} 
            />
            {!!currentDistrict ? (
              <input 
                placeholder="District" 
                className="p-2 border rounded bg-slate-100 dark:bg-slate-800 text-slate-500" 
                value={formData.district} 
                disabled={true} 
              />
            ) : (
              <select 
                className="p-2 border rounded bg-white dark:bg-slate-950" 
                value={formData.district} 
                onChange={e => setFormData({
                  ...formData, 
                  district: e.target.value, 
                  taluka: "" // Reset taluka when district changes
                })}
              >
                <option value="">Select District</option>
                {GUJARAT_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            )}

            {!!currentTaluka ? (
              <input 
                placeholder="Taluka" 
                className="p-2 border rounded bg-slate-100 dark:bg-slate-800 text-slate-500" 
                value={formData.taluka} 
                disabled={true} 
              />
            ) : (
              <select 
                className="p-2 border rounded bg-white dark:bg-slate-950" 
                value={formData.taluka} 
                disabled={!formData.district}
                onChange={e => setFormData({...formData, taluka: e.target.value})} 
              >
                <option value="">Select Taluka</option>
                {getTalukasForDistrict(formData.district).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            )}
            <input 
              placeholder="Village" 
              className="p-2 border rounded" 
              value={formData.village} 
              onChange={e => setFormData({...formData, village: e.target.value})} 
            />
          </div>
          <button type="submit" className="w-full py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800">
            Save Admin
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-slate-500 uppercase text-xs">
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Location</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3">
                  <p className="font-bold">{admin.fullName}</p>
                  <p className="text-xs text-slate-500">{admin.username}</p>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded">
                    {admin.role}
                  </span>
                </td>
                <td className="p-3 text-xs text-slate-600">
                  {admin.state || "India"} {admin.district ? `> ${admin.district}` : ""} {admin.taluka ? `> ${admin.taluka}` : ""}
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => handleDelete(admin.id)} className="text-red-500 text-sm font-bold hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr><td colSpan={4} className="p-4 text-center text-slate-500">No admins created yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
