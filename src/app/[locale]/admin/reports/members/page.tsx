import { requireAdminAuth } from "@/lib/rbac";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Users, FileText, Download, Filter } from "lucide-react";

export default async function MemberReportsPage() {
  await requireAdminAuth();

  return (
    <div className="flex flex-col h-full space-y-6 p-6">
      <AdminBreadcrumbs />
      <div className="pb-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Member Reports</h1>
        <p className="text-slate-500">View and export member demographics and statistics.</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
        <div className="flex items-center gap-3 text-sm">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-700 dark:text-slate-300 font-medium">Filter by:</span>
          <select className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-slate-700 dark:text-slate-300 outline-none focus:border-primary transition-colors shadow-sm">
            <option>All Locations</option>
            <option>State Level</option>
            <option>District Level</option>
          </select>
          <select className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-slate-700 dark:text-slate-300 outline-none focus:border-primary transition-colors shadow-sm">
            <option>All Memberships</option>
            <option>Active Lifetime</option>
            <option>Expired</option>
          </select>
        </div>
        
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-slate-950 font-bold px-4 py-2 rounded-lg transition-colors text-sm">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 p-6 flex-1 flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Member Distribution
          </h3>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl min-h-[400px]">
          <FileText className="w-12 h-12 text-slate-400 dark:text-slate-600 mb-3" />
          <h4 className="text-slate-900 dark:text-white font-medium text-lg">No reports generated yet</h4>
          <p className="text-slate-400 text-sm mt-1 max-w-sm text-center">
            Select your filters above and click generate to view detailed member demographic and location reports.
          </p>
        </div>
      </div>
    </div>
  );
}
