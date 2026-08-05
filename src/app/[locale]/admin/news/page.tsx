import { getNewsArticles } from "@/actions/admin/news";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import { Search, Plus, Edit, Trash2, Eye, FileText, Send, Radio, Download, Printer, CheckCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { requireAdminAuth } from "@/lib/rbac";
import { canApproveContent } from "@/lib/cms-rbac";
import NewsActionButtons from "./NewsActionButtons";

export const dynamic = 'force-dynamic';

export default async function NewsDashboardPage() {
  const session = await requireAdminAuth();
  const articles = await getNewsArticles();

  const total = articles.length;
  const published = articles.filter(a => a.status === "PUBLISHED").length;
  const drafts = articles.filter(a => a.status === "DRAFT").length;
  const pending = articles.filter(a => a.status === "PENDING_APPROVAL").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <AdminBreadcrumbs />
        <Link href="/admin/news/create">
          <Button className="bg-slate-900 text-white hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" /> Create Content
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatsCard title="Total Articles" value={total.toString()} icon={FileText} />
        <AdminStatsCard title="Published" value={published.toString()} icon={Send} />
        <AdminStatsCard title="Drafts" value={drafts.toString()} icon={Edit} />
        <AdminStatsCard title="Pending Approval" value={pending.toString()} icon={CheckCircle} />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your CMS Content</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search content..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Content</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Scope</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No content found in your jurisdiction. Click 'Create Content' to start.
                  </td>
                </tr>
              ) : (
                articles.map((article: any) => {
                  const enTrans = article.translations.find((t: any) => t.language === 'en');
                  const canApprove = canApproveContent(session.role, article.creatorRole);
                  const canDelete = session.role === "SUPER_ADMIN" || session.id === article.authorId || canApprove;

                  return (
                    <tr key={article.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                      <td className="p-4">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                          {enTrans ? enTrans.title : "Untitled"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {article.isPressRelease ? 'PRESS RELEASE' : 'NEWS ARTICLE'} • Created by {article.creatorRole}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                          article.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 
                          article.status === 'PENDING_APPROVAL' ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {article.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-xs text-slate-500">
                          {article.state || "National"} {article.district ? `> ${article.district}` : ""}
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        <NewsActionButtons 
                          articleId={article.id} 
                          status={article.status} 
                          canApprove={canApprove}
                          canDelete={canDelete}
                        />
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
