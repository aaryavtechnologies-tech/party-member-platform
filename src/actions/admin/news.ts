"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import { determineStatusOnSubmit, getCmsLocationFilter, canApproveContent, canMarkBreaking, canMarkFeatured } from "@/lib/cms-rbac";
import { ArticleStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getNewsArticles() {
  const session = await requireAdminAuth();
  const locationFilter = getCmsLocationFilter(session);

  return prisma.newsArticle.findMany({
    where: locationFilter,
    include: {
      translations: true,
      categories: true,
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function createNewsArticle(data: any, requestedStatus: ArticleStatus) {
  const session = await requireAdminAuth();
  
  // Enforce workflow rules
  const finalStatus = determineStatusOnSubmit(session.role, requestedStatus, true);

  // Security checks for featured/breaking
  const isFeatured = canMarkFeatured(session.role) ? data.isFeatured : false;
  const isBreaking = canMarkBreaking(session.role) ? data.isBreaking : false;

  const article = await prisma.newsArticle.create({
    data: {
      authorId: session.id,
      creatorRole: session.role,
      status: finalStatus,
      isFeatured,
      isBreaking,
      isPressRelease: data.isPressRelease || false,
      
      // Strict Location Scope Enforcement
      state: session.state,
      district: session.district,
      taluka: session.taluka,
      village: session.village,

      publishedAt: finalStatus === "PUBLISHED" ? new Date() : null,

      translations: {
        create: {
          language: data.language || "en",
          title: data.title,
          slug: data.slug,
          summary: data.summary,
          content: data.content,
        }
      }
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.id,
      action: "CREATE_NEWS",
      details: `Created news article: ${article.id} with status: ${finalStatus}`,
    }
  });

  revalidatePath("/admin/news");
  return article;
}

export async function approveNewsArticle(articleId: string) {
  const session = await requireAdminAuth();

  const article = await prisma.newsArticle.findUnique({ where: { id: articleId } });
  if (!article) throw new Error("Article not found");

  if (!canApproveContent(session.role, article.creatorRole)) {
    throw new Error("Unauthorized to approve this content level.");
  }

  const updated = await prisma.newsArticle.update({
    where: { id: articleId },
    data: { 
      status: "PUBLISHED", 
      approvedById: session.id,
      publishedAt: new Date()
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.id,
      action: "APPROVE_NEWS",
      details: `Approved news article: ${article.id}`,
    }
  });

  revalidatePath("/admin/news");
  return updated;
}

export async function deleteNewsArticle(articleId: string) {
  const session = await requireAdminAuth();
  
  // Can only delete if it's within their jurisdiction
  const article = await prisma.newsArticle.findUnique({ where: { id: articleId } });
  if (!article) throw new Error("Article not found");

  if (article.authorId !== session.id && session.role !== "SUPER_ADMIN" && !canApproveContent(session.role, article.creatorRole)) {
    throw new Error("Unauthorized to delete this content.");
  }

  await prisma.newsArticle.delete({ where: { id: articleId } });

  await prisma.auditLog.create({
    data: {
      userId: session.id,
      action: "DELETE_NEWS",
      details: `Deleted news article: ${articleId}`,
    }
  });

  revalidatePath("/admin/news");
  return { success: true };
}
