import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Plus, Search, Filter, MoreHorizontal, Edit, Settings } from "lucide-react";

export default async function OrganizationLevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  
  // Validate level string
  const validLevels = ["national", "state", "district", "taluka", "village"];
  if (!validLevels.includes(level.toLowerCase())) {
    notFound();
  }

  const enumLevel = level.toUpperCase() as "NATIONAL" | "STATE" | "DISTRICT" | "TALUKA" | "VILLAGE";

  // Fetch data
  const units = await prisma.organizationUnit.findMany({
    where: { level: enumLevel },
    include: {
      parent: true,
      _count: {
        select: { assignments: { where: { status: "ACTIVE" } } }
      }
    }
  });

  const title = level.charAt(0).toUpperCase() + level.slice(1) + " Level";

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title} Management</h1>
          <p className="text-slate-500">Manage organizational units and leadership assignments at the {level} level.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Settings className="w-4 h-4" /> Manage Positions
          </button>
          <button className="px-4 py-2 bg-primary text-slate-950 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Unit
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={`Search ${level} units...`} 
              className="w-full h-10 pl-9 pr-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
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
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{unit.name}</p>
                      <p className="text-xs text-slate-500 font-mono">ID: {unit.id.substring(0,8)}</p>
                    </td>
                    {enumLevel !== "NATIONAL" && (
                      <td className="p-4 text-sm text-slate-700 dark:text-slate-300">
                        {unit.parent?.name || "—"}
                      </td>
                    )}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {unit._count.assignments}
                        </span>
                        <span className="text-xs text-slate-500">Assignments</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                        Active
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors" title="Manage Assignments">
                          <Plus className="w-4 h-4" />
                        </button>
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
    </div>
  );
}
