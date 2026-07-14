import { prisma } from "@/lib/prisma";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, FileText, Send, Radio } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default async function NewsDashboardPage() {
  const articles = await prisma.newsArticle.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      translations: true,
      categories: true,
    }
  });

  const total = articles.length;
  const published = articles.filter(a => a.status === "PUBLISHED").length;
  const drafts = articles.filter(a => a.status === "DRAFT").length;
  const featured = articles.filter(a => a.isFeatured).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <AdminBreadcrumbs />
        <Link href="/admin/news/create">
          <Button className="bg-slate-900 text-white hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" /> Create Article
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatsCard 
          title="Total Articles"
          value={total.toString()}
          icon={FileText}
          trend="+12%"
          trendUp={true}
        />
        <AdminStatsCard 
          title="Published"
          value={published.toString()}
          icon={Send}
          trend="+5%"
          trendUp={true}
        />
        <AdminStatsCard 
          title="Drafts"
          value={drafts.toString()}
          icon={Edit}
        />
        <AdminStatsCard 
          title="Featured"
          value={featured.toString()}
          icon={Radio}
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Articles</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title (English)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Views</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No articles found. Click 'Create Article' to write your first news piece.
                  </td>
                </tr>
              ) : (
                articles.map((article: any) => {
                  const enTrans = article.translations.find((t: any) => t.language === 'en');
                  return (
                    <tr key={article.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                      <td className="p-4">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                          {enTrans ? enTrans.title : "Untitled"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {enTrans ? `/${enTrans.slug}` : ""}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          article.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 
                          article.status === 'DRAFT' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {article.isPressRelease && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-medium">PR</span>
                          )}
                          {article.isFeatured && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md font-medium">Featured</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-600">{article.views}</td>
                      <td className="p-4 text-sm text-slate-500">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {enTrans && (
                            <Link href={`/news/${enTrans.slug}`} target="_blank">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          )}
                          <Link href={`/admin/news/edit/${article.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-600">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
