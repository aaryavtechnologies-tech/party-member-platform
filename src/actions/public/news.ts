"use server";

import { prisma } from "@/lib/prisma";

export async function incrementNewsShare(articleId: string) {
  try {
    await prisma.newsArticle.update({
      where: { id: articleId },
      data: { shares: { increment: 1 } }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to increment share:", error);
    return { success: false };
  }
}

export async function incrementNewsPrint(articleId: string) {
  try {
    await prisma.newsArticle.update({
      where: { id: articleId },
      data: { prints: { increment: 1 } }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to increment print:", error);
    return { success: false };
  }
}

export async function incrementNewsDownload(articleId: string) {
  try {
    await prisma.newsArticle.update({
      where: { id: articleId },
      data: { downloads: { increment: 1 } }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to increment download:", error);
    return { success: false };
  }
}
