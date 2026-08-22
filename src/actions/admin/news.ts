"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import { determineStatusOnSubmit, getCmsLocationFilter, canApproveContent, canMarkBreaking, canMarkFeatured } from "@/lib/cms-rbac";
import { ArticleStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

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

  const translationsToCreate = [
    {
      language: "en",
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
    }
  ];

  if (data.titleGu) {
    translationsToCreate.push({
      language: "gu",
      title: data.titleGu,
      slug: data.slugGu || `${data.slug}-gu`,
      summary: data.summaryGu || data.summary,
      content: data.contentGu || data.content,
    });
  }

  const article = await prisma.newsArticle.create({
    data: {
      authorId: session.id,
      creatorRole: session.role,
      status: finalStatus,
      isFeatured,
      isBreaking,
      isPressRelease: data.isPressRelease || false,
      isMemberOnly: data.isMemberOnly || false,
      featuredImage: data.featuredImage || null,
      
      contactName: data.contactName || null,
      contactDesignation: data.contactDesignation || null,
      contactEmail: data.contactEmail || null,
      contactMobile: data.contactMobile || null,

      // Strict Location Scope Enforcement
      state: session.state,
      district: session.district,
      taluka: session.taluka,
      village: session.village,

      publishedAt: finalStatus === "PUBLISHED" ? new Date() : null,

      translations: {
        create: translationsToCreate,
      },

      ...(data.categoryId ? {
        categories: {
          connect: [{ id: data.categoryId }]
        }
      } : {}),

      ...(data.tagId ? {
        tags: {
          connect: [{ id: data.tagId }]
        }
      } : {})
    }
  });

  await logAudit(
    session.id,
    "CREATE_NEWS",
    `Created news article: ${article.id} with status: ${finalStatus}`
  );

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

  await logAudit(
    session.id,
    "APPROVE_NEWS",
    `Approved news article: ${article.id}`
  );

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

  await logAudit(
    session.id,
    "DELETE_NEWS",
    `Deleted news article: ${articleId}`
  );

  revalidatePath("/admin/news");
  return { success: true };
}

export async function getNewsArticleById(articleId: string) {
  const session = await requireAdminAuth();
  const locationFilter = getCmsLocationFilter(session);

  const article = await prisma.newsArticle.findFirst({
    where: {
      id: articleId,
      ...locationFilter,
    },
    include: {
      translations: true,
      categories: true,
      tags: true,
    }
  });

  return article;
}

export async function updateNewsArticle(articleId: string, data: any, requestedStatus?: ArticleStatus) {
  const session = await requireAdminAuth();
  
  const existing = await prisma.newsArticle.findUnique({
    where: { id: articleId },
    include: { translations: true, categories: true, tags: true }
  });

  if (!existing) {
    throw new Error("Article not found");
  }

  if (existing.authorId !== session.id && session.role !== "SUPER_ADMIN" && !canApproveContent(session.role, existing.creatorRole)) {
    throw new Error("Unauthorized to edit this article.");
  }

  const finalStatus = requestedStatus 
    ? determineStatusOnSubmit(session.role, requestedStatus, true) 
    : existing.status;

  const isFeatured = canMarkFeatured(session.role) ? (data.isFeatured ?? existing.isFeatured) : false;
  const isBreaking = canMarkBreaking(session.role) ? (data.isBreaking ?? existing.isBreaking) : false;

  // Handle English translation
  if (data.title !== undefined || data.content !== undefined || data.summary !== undefined) {
    const enTrans = existing.translations.find(t => t.language === "en");
    if (enTrans) {
      await prisma.newsTranslation.update({
        where: { id: enTrans.id },
        data: {
          title: data.title ?? enTrans.title,
          slug: data.slug ?? enTrans.slug,
          summary: data.summary ?? enTrans.summary,
          content: data.content ?? enTrans.content,
        }
      });
    } else {
      await prisma.newsTranslation.create({
        data: {
          articleId: existing.id,
          language: "en",
          title: data.title || "Untitled",
          slug: data.slug || `${existing.id}-en`,
          summary: data.summary || "",
          content: data.content || "",
        }
      });
    }
  }

  // Handle Gujarati translation
  if (data.titleGu !== undefined || data.contentGu !== undefined || data.summaryGu !== undefined) {
    const guTrans = existing.translations.find(t => t.language === "gu");
    if (guTrans) {
      await prisma.newsTranslation.update({
        where: { id: guTrans.id },
        data: {
          title: data.titleGu ?? guTrans.title,
          slug: data.slugGu ?? guTrans.slug,
          summary: data.summaryGu ?? guTrans.summary,
          content: data.contentGu ?? guTrans.content,
        }
      });
    } else if (data.titleGu) {
      await prisma.newsTranslation.create({
        data: {
          articleId: existing.id,
          language: "gu",
          title: data.titleGu,
          slug: data.slugGu || `${existing.id}-gu`,
          summary: data.summaryGu || "",
          content: data.contentGu || "",
        }
      });
    }
  }

  const updated = await prisma.newsArticle.update({
    where: { id: articleId },
    data: {
      status: finalStatus,
      isFeatured,
      isBreaking,
      isPressRelease: data.isPressRelease ?? existing.isPressRelease,
      isMemberOnly: data.isMemberOnly ?? existing.isMemberOnly,
      featuredImage: data.featuredImage !== undefined ? data.featuredImage : existing.featuredImage,
      
      contactName: data.contactName !== undefined ? data.contactName : existing.contactName,
      contactDesignation: data.contactDesignation !== undefined ? data.contactDesignation : existing.contactDesignation,
      contactEmail: data.contactEmail !== undefined ? data.contactEmail : existing.contactEmail,
      contactMobile: data.contactMobile !== undefined ? data.contactMobile : existing.contactMobile,

      publishedAt: finalStatus === "PUBLISHED" ? (existing.publishedAt || new Date()) : existing.publishedAt,

      categories: data.categoryId ? {
        set: [{ id: data.categoryId }]
      } : undefined,

      tags: data.tagId ? {
        set: [{ id: data.tagId }]
      } : undefined,
    },
    include: {
      translations: true,
      categories: true,
      tags: true,
    }
  });

  await logAudit(
    session.id,
    "UPDATE_NEWS",
    `Updated news article: ${articleId} with status: ${finalStatus}`
  );

  revalidatePath("/admin/news");
  revalidatePath(`/admin/news/edit/${articleId}`);
  return updated;
}
