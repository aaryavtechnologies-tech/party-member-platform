import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { NewsEditClient } from "./NewsEditClient";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import { canMarkFeatured, canMarkBreaking } from "@/lib/cms-rbac";
import { getNewsArticleById } from "@/actions/admin/news";
import { notFound } from "next/navigation";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const session = await requireAdminAuth();
  
  const article = await getNewsArticleById(id);
  if (!article) {
    notFound();
  }

  const categories = await prisma.newsCategory.findMany();
  const tags = await prisma.newsTag.findMany();

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <NewsEditClient 
          article={article}
          categories={categories} 
          tags={tags} 
          canFeature={canMarkFeatured(session.role)}
          canBreak={canMarkBreaking(session.role)}
        />
      </div>
    </div>
  );
}
