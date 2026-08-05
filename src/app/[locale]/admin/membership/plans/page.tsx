import { getMembershipStats, getMemberships } from "@/actions/admin/membership";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Users, FileText, IndianRupee, Trophy, Star, Shield, Filter, Search, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminMembershipPlansPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page) : 1;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : undefined;
  const tier = typeof resolvedParams.tier === "string" ? resolvedParams.tier : "ALL";
  const status = typeof resolvedParams.status === "string" ? resolvedParams.status : "ALL";

  const [statsRes, membersRes] = await Promise.all([
    getMembershipStats(),
    getMemberships({ page, limit: 15, search, tier, status })
  ]);

  const stats = statsRes.success ? statsRes.stats : null;
  const data = membersRes.success ? membersRes.data : null;

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Membership Plans</h2>
          <p className="text-slate-500">Manage member tiers, track active plans, and monitor revenue.</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Active Members" 
            value={stats.activeMembers} 
            subtitle="All currently active profiles"
            icon={<Users className="w-5 h-5 text-blue-500" />}
            trend={stats.totalMembers ? Math.round((stats.activeMembers / stats.totalMembers) * 100) + "%" : "0%"}
          />
          <StatCard 
            title="Primary Members" 
            value={stats.primaryMembers} 
            subtitle="Base membership tier"
            icon={<Shield className="w-5 h-5 text-slate-500" />}
          />
          <StatCard 
            title="Lifetime Members" 
            value={stats.lifetimePrimary + stats.lifetimeActive} 
            subtitle="Premium tier members"
            icon={<Trophy className="w-5 h-5 text-orange-500" />}
            trend={stats.recentUpgrades + " recent"}
          />
          <StatCard 
            title="Est. Revenue" 
            value={`₹${stats.totalRevenue.toLocaleString()}`} 
            subtitle="From successful upgrades"
            icon={<IndianRupee className="w-5 h-5 text-emerald-500" />}
          />
        </div>
      )}

      {/* Data Table Container */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {/* Filters/Search Bar (Placeholder for actual interactive components) */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, ID or mobile..." 
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              defaultValue={search}
              readOnly // In a real implementation this would trigger a router.push
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none">
              <option value="ALL">All Tiers</option>
              <option value="PRIMARY">Primary</option>
              <option value="LIFETIME_PRIMARY">Lifetime Primary</option>
              <option value="LIFETIME_ACTIVE">Lifetime Active</option>
            </select>
            <button className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-900/50 uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Member</th>
                <th className="px-6 py-4 font-bold tracking-wider">Contact</th>
                <th className="px-6 py-4 font-bold tracking-wider">Membership Tier</th>
                <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Issue Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data?.members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                      <p>No members found matching the current criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data?.members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {member.user?.image ? (
                          <img src={member.user.image} alt={member.user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {member.user?.name.charAt(0) || "U"}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{member.user?.name}</p>
                          <p className="text-xs font-medium text-slate-500 uppercase">{member.memberId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{member.mobile}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <TierBadge tier={member.membershipType} />
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 text-xs font-bold rounded-full tracking-wide",
                        member.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" :
                        member.status === "PENDING_VERIFICATION" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" :
                        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                      )}>
                        {member.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500">
                      {new Date(member.issueDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {data && data.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Showing page {data.page} of {data.totalPages}
            </span>
            <div className="flex gap-1">
              <button disabled={data.page === 1} className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-sm font-medium disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800">
                Previous
              </button>
              <button disabled={data.page === data.totalPages} className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-sm font-medium disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Subcomponents

function StatCard({ title, value, subtitle, icon, trend }: { title: string, value: string | number, subtitle: string, icon: React.ReactNode, trend?: string }) {
  return (
    <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{value}</div>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function TierBadge({ tier }: { tier: string }) {
  switch (tier) {
    case "LIFETIME_ACTIVE":
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-sm">
          <Star className="w-3.5 h-3.5 fill-white/20" />
          Lifetime Active
        </div>
      );
    case "LIFETIME_PRIMARY":
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-white text-xs font-bold shadow-sm">
          <Shield className="w-3.5 h-3.5 text-orange-400" />
          Lifetime Primary
        </div>
      );
    default:
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          Primary
        </div>
      );
  }
}
