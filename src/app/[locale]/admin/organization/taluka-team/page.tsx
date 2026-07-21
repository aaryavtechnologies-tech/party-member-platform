import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, Map, Activity, Plus, Search, Download, MoreHorizontal } from "lucide-react";
import { Link } from "@/i18n/routing";

export default async function AdminTalukaDashboardPage() {
  const t = await getTranslations("Admin");

  // Fetch Analytics
  const totalTalukas = await prisma.organizationUnit.count({
    where: { level: { priority: 4 } }
  });
  
  const activeTalukas = await prisma.organizationUnit.count({
    where: { level: { priority: 4 }, deletedAt: null }
  });

  const totalVillages = await prisma.organizationUnit.count({
    where: { level: { priority: 5 } }
  });

  // Fetch recent Talukas for the table
  const recentTalukas = await prisma.organizationUnit.findMany({
    where: { level: { priority: 4 } },
    include: {
      parent: { select: { nameEn: true, parent: { select: { nameEn: true } } } },
      _count: { select: { children: true, officeBearers: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Taluka Management</h1>
          <p className="text-muted-foreground">Manage talukas, village mapping, and leadership.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md font-medium text-sm transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm transition-colors">
            <Plus className="w-4 h-4" /> Add Taluka
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Talukas</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTalukas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500 font-medium">{activeTalukas} Active</span> across all districts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Villages</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVillages}</div>
            <p className="text-xs text-muted-foreground mt-1">Mapped under Talukas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taluka Leaders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentTalukas.reduce((acc, taluka) => acc + taluka._count.officeBearers, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active office bearers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Villages per Taluka</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTalukas > 0 ? Math.round(totalVillages / totalTalukas) : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Global average</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Taluka Units Directory</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search talukas..." 
              className="w-full bg-background border border-input rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground text-xs uppercase font-medium border-b">
                <tr>
                  <th className="px-4 py-3">Taluka Name</th>
                  <th className="px-4 py-3">District</th>
                  <th className="px-4 py-3">State</th>
                  <th className="px-4 py-3">Villages</th>
                  <th className="px-4 py-3">Leaders</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentTalukas.length > 0 ? recentTalukas.map((taluka) => (
                  <tr key={taluka.id} className="bg-background hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{taluka.nameEn}</td>
                    <td className="px-4 py-3">{taluka.parent?.nameEn || "-"}</td>
                    <td className="px-4 py-3">{taluka.parent?.parent?.nameEn || "-"}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 py-0.5 px-2 rounded-full text-xs font-semibold">
                        {taluka._count.children}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 py-0.5 px-2 rounded-full text-xs font-semibold">
                        {taluka._count.officeBearers}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`py-0.5 px-2 rounded-full text-xs font-semibold ${
                        taluka.deletedAt === null 
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" 
                          : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                      }`}>
                        {taluka.deletedAt === null ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No taluka units found. Add one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
