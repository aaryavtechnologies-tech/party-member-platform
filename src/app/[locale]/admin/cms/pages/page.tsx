import { prisma } from "@/lib/prisma";
import { CmsPage } from "@prisma/client";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Search, Plus, MoreHorizontal, Edit, Globe, FileText, Trash2 } from "lucide-react";
import { Link } from "@/i18n/routing";

export default async function CMSPagesTable() {
  const pages = await prisma.cmsPage.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "PUBLISHED": return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200";
      case "DRAFT": return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200";
      case "ARCHIVED": return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Website Pages</h1>
          <p className="text-slate-500">Manage all static routes and rich text content across the platform.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/cms/pages/new">
            <button className="px-4 py-2 bg-primary text-slate-950 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Page
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search pages by title or slug..." 
              className="w-full h-10 pl-9 pr-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <select className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium outline-none">
              <option>All Languages</option>
              <option>English (en)</option>
              <option>Gujarati (gu)</option>
            </select>
            <select className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium outline-none">
              <option>All Statuses</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4">Page Title</th>
                <th className="p-4">URL Slug</th>
                <th className="p-4">Language</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                    No pages have been created yet. Click "Create Page" to start building your website.
                  </td>
                </tr>
              ) : (
                pages.map((page: CmsPage) => (
                  <tr key={page.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{page.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {page.seoTitle && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-[9px] font-bold uppercase">SEO Optimized</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-500 text-sm font-mono">
                        <Globe className="w-3.5 h-3.5" />
                        /{page.slug}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 uppercase">
                        {page.language === 'en' ? 'English' : page.language === 'gu' ? 'Gujarati' : page.language}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(page.status)}`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                      <p>{new Date(page.updatedAt).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/cms/pages/${page.id}`}>
                          <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors" title="Edit Page">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors" title="Delete Page">
                          <Trash2 className="w-4 h-4" />
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
