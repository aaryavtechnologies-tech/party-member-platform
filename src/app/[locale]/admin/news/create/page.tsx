import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { NewsEditorClient } from "./NewsEditorClient";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import { canMarkFeatured, canMarkBreaking } from "@/lib/cms-rbac";

export default async function CreateNewsPage() {
  const session = await requireAdminAuth();
  
  // Fetch available categories and tags for the multi-select
  const categories = await prisma.newsCategory.findMany();
  const tags = await prisma.newsTag.findMany();

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <NewsEditorClient 
          categories={categories} 
          tags={tags} 
          canFeature={canMarkFeatured(session.role)}
          canBreak={canMarkBreaking(session.role)}
        />
      </div>
    </div>
  );
}
