import { prisma } from "@/lib/prisma";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import { ShieldCheck, MapPin, Map, Users, Network, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";

export default async function OrganizationOverviewPage() {
  const [nationalCount, stateCount, districtCount, activeAssignments] = await Promise.all([
    prisma.organizationUnit.count({ where: { level: { priority: 1 } } }), // Assuming priority 1 is National
    prisma.organizationUnit.count({ where: { level: { priority: 2 } } }), // Assuming priority 2 is State
    prisma.organizationUnit.count({ where: { level: { priority: 3 } } }), // Assuming priority 3 is District
    prisma.officeBearer.count({ where: { status: "ACTIVE" } })
  ]);

  const hierarchyLevels = [
    { title: "National Level", href: "/admin/organization/national", icon: ShieldCheck, color: "text-blue-600 bg-blue-100", count: nationalCount },
    { title: "State Level", href: "/admin/organization/state", icon: Map, color: "text-emerald-600 bg-emerald-100", count: stateCount },
    { title: "District Level", href: "/admin/organization/district", icon: MapPin, color: "text-orange-600 bg-orange-100", count: districtCount },
    { title: "Taluka Level", href: "/admin/organization/taluka", icon: MapPin, color: "text-purple-600 bg-purple-100", count: "..." },
    { title: "Village Level", href: "/admin/organization/village", icon: MapPin, color: "text-rose-600 bg-rose-100", count: "..." },
  ];

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Organization Management</h1>
          <p className="text-slate-500">Manage the complete party hierarchy and leadership assignments.</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AdminStatsCard title="National Units" value={nationalCount} icon={ShieldCheck} className="p-4 sm:p-6" />
        <AdminStatsCard title="State Units" value={stateCount} icon={Map} className="p-4 sm:p-6" />
        <AdminStatsCard title="District Units" value={districtCount} icon={MapPin} className="p-4 sm:p-6" />
        <AdminStatsCard title="Active Assignments" value={activeAssignments} icon={Users} className="p-4 sm:p-6" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Hierarchy Navigation */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" /> Select Structural Level
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {hierarchyLevels.map((level, i) => (
              <Link key={i} href={level.href}>
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all group flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${level.color}`}>
                      <level.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{level.title}</h3>
                      <p className="text-sm text-slate-500">{level.count} Registered Units</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Insights Placeholder */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Assignments</h3>
          <div className="space-y-4">
            <div className="text-center py-12">
              <p className="text-sm text-slate-500 font-medium">No recent assignments.</p>
              <p className="text-xs text-slate-400 mt-1">Assignments will appear here.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
