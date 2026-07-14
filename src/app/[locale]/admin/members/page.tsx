import { prisma } from "@/lib/prisma";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import { Users, UserCheck, UserX, UserMinus, Search, Filter, MoreHorizontal, Mail, ShieldAlert, Edit, Eye } from "lucide-react";
import { Link } from "@/i18n/routing";

// This is a Server Component
export default async function AdminMembersPage() {
  // Fetch actual data from DB
  const [totalMembers, activeMembers, suspendedMembers, pendingMembers, allProfiles] = await Promise.all([
    prisma.memberProfile.count(),
    prisma.memberProfile.count({ where: { status: "ACTIVE" } }),
    prisma.memberProfile.count({ where: { status: "SUSPENDED" } }),
    prisma.memberProfile.count({ where: { status: "PENDING_VERIFICATION" } }),
    prisma.memberProfile.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
      case "PENDING_VERIFICATION": return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
      case "SUSPENDED": return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
      case "BLOCKED": return "bg-slate-800 text-slate-300";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const getTypeBadge = (type: string) => {
    switch(type) {
      case "LIFETIME_ACTIVE": return "border-primary text-primary bg-primary/5";
      case "LIFETIME_PRIMARY": return "border-blue-500 text-blue-600 bg-blue-500/5 dark:text-blue-400";
      default: return "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Member Management</h1>
          <p className="text-slate-500">View and manage all registered members.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors">
            Export CSV
          </button>
          <button className="px-4 py-2 bg-primary text-slate-950 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors">
            Add Member
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AdminStatsCard title="Total Members" value={totalMembers} icon={Users} className="p-4 sm:p-6" />
        <AdminStatsCard title="Active Members" value={activeMembers} icon={UserCheck} className="p-4 sm:p-6" />
        <AdminStatsCard title="Pending Verification" value={pendingMembers} icon={UserMinus} className="p-4 sm:p-6" />
        <AdminStatsCard title="Suspended" value={suspendedMembers} icon={UserX} className="p-4 sm:p-6" />
      </div>

      {/* Member Table Section */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID, Name, Phone..." 
              className="w-full h-10 pl-9 pr-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <button className="h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900 whitespace-nowrap">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <select className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium outline-none">
              <option>All Types</option>
              <option>Primary</option>
              <option>Lifetime Primary</option>
              <option>Lifetime Active</option>
            </select>
            <select className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium outline-none">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-slate-300" />
                </th>
                <th className="p-4">Member Info</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Location</th>
                <th className="p-4">Type & Status</th>
                <th className="p-4">Reg. Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {allProfiles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    No members found in the database.
                  </td>
                </tr>
              ) : (
                allProfiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                    <td className="p-4 text-center">
                      <input type="checkbox" className="rounded border-slate-300" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden text-lg font-bold text-slate-500">
                          {profile.user.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={profile.user.image} alt={profile.user.name} className="w-full h-full object-cover" />
                          ) : (
                            profile.user.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{profile.user.name}</p>
                          <p className="text-xs font-mono text-slate-500">{profile.memberId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-700 dark:text-slate-300">{profile.mobile}</p>
                      <p className="text-xs text-slate-500">{profile.user.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-700 dark:text-slate-300">{profile.district}</p>
                      <p className="text-xs text-slate-500">{profile.state}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getTypeBadge(profile.membershipType)}`}>
                          {profile.membershipType.replace("_", " ")}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(profile.status)}`}>
                          {profile.status.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/members/${profile.id}`}>
                          <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors" title="View Profile">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors" title="Edit">
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

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 text-sm">
          <p className="text-slate-500">Showing {allProfiles.length} entries</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-400 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 rounded bg-primary text-slate-950 font-bold">1</button>
            <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
