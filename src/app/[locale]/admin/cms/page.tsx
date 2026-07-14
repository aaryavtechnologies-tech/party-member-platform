import { prisma } from "@/lib/prisma";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import { FileText, Image as ImageIcon, BookOpen, Layers, Edit3, Settings } from "lucide-react";
import { Link } from "@/i18n/routing";

export default async function CMSOverviewPage() {
  const [totalPages, publishedPages, draftPages, mediaFiles] = await Promise.all([
    prisma.cmsPage.count(),
    prisma.cmsPage.count({ where: { status: "PUBLISHED" } }),
    prisma.cmsPage.count({ where: { status: "DRAFT" } }),
    prisma.mediaFile.count()
  ]);

  const quickActions = [
    { title: "Manage Pages", href: "/admin/cms/pages", icon: FileText, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30", description: "Edit website content and static pages." },
    { title: "Media Library", href: "/admin/cms/media", icon: ImageIcon, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30", description: "Upload images, PDFs, and videos." },
    { title: "FAQ Manager", href: "/admin/cms/faq", icon: BookOpen, color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30", description: "Manage dynamic FAQ sections." },
    { title: "Site Menus", href: "/admin/cms/menus", icon: Layers, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30", description: "Edit header and footer navigation." },
  ];

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Content Management</h1>
          <p className="text-slate-500">Manage all website content, media, and navigation from one place.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/cms/pages/new">
            <button className="px-4 py-2 bg-primary text-slate-950 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Edit3 className="w-4 h-4" /> New Page
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AdminStatsCard title="Total Pages" value={totalPages} icon={FileText} className="p-4 sm:p-6" />
        <AdminStatsCard title="Published" value={publishedPages} icon={BookOpen} className="p-4 sm:p-6" />
        <AdminStatsCard title="Drafts" value={draftPages} icon={Edit3} className="p-4 sm:p-6" />
        <AdminStatsCard title="Media Files" value={mediaFiles} icon={ImageIcon} className="p-4 sm:p-6" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> CMS Modules
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href}>
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all group flex items-start gap-4 cursor-pointer h-full">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${action.color}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{action.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 leading-snug">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Edits</h3>
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
            <FileText className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-sm text-slate-500 font-medium">No recent activity.</p>
            <p className="text-xs text-slate-400 mt-1">Updates to pages and media will appear here.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
