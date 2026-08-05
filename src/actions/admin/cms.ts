"use server";

import { prisma } from "@/lib/prisma";
import { ContentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getCmsPages(params: { page?: number; limit?: number; search?: string }) {
  try {
    const { page = 1, limit = 20, search } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.translations = {
        some: {
          title: { contains: search, mode: "insensitive" }
        }
      };
    }

    const [pages, total] = await Promise.all([
      prisma.cmsPage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          translations: {
            select: {
              language: true,
              title: true,
              slug: true
            }
          }
        }
      }),
      prisma.cmsPage.count({ where })
    ]);

    return {
      success: true,
      data: {
        pages,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error("Error fetching CMS pages:", error);
    return { success: false, error: "Failed to fetch pages" };
  }
}

export async function getCmsPageById(id: string) {
  try {
    const page = await prisma.cmsPage.findUnique({
      where: { id },
      include: {
        translations: true
      }
    });

    if (!page) {
      return { success: false, error: "Page not found" };
    }

    return { success: true, page };
  } catch (error) {
    console.error("Error fetching CMS page:", error);
    return { success: false, error: "Failed to fetch page" };
  }
}

export async function upsertCmsPage(data: {
  id?: string;
  status: ContentStatus;
  translations: {
    language: string;
    title: string;
    slug: string;
    content: string;
    seoTitle?: string;
    seoDescription?: string;
  }[];
}) {
  try {
    const { id, status, translations } = data;

    let pageId = id;

    if (id) {
      // Update existing
      await prisma.cmsPage.update({
        where: { id },
        data: { status }
      });

      // Update or create translations
      for (const t of translations) {
        await prisma.cmsPageTranslation.upsert({
          where: {
            pageId_language: {
              pageId: id,
              language: t.language
            }
          },
          update: {
            title: t.title,
            slug: t.slug,
            content: t.content,
            seoTitle: t.seoTitle,
            seoDescription: t.seoDescription
          },
          create: {
            pageId: id,
            language: t.language,
            title: t.title,
            slug: t.slug,
            content: t.content,
            seoTitle: t.seoTitle,
            seoDescription: t.seoDescription
          }
        });
      }
    } else {
      // Create new
      const newPage = await prisma.cmsPage.create({
        data: {
          status,
          translations: {
            create: translations.map((t) => ({
              language: t.language,
              title: t.title,
              slug: t.slug,
              content: t.content,
              seoTitle: t.seoTitle,
              seoDescription: t.seoDescription
            }))
          }
        }
      });
      pageId = newPage.id;
    }

    // Revalidate paths for all slugs so frontend updates instantly
    translations.forEach((t) => {
      revalidatePath(`/${t.language}/p/${t.slug}`);
      // Also revalidate the main route in case it's mapped directly
      revalidatePath(`/${t.language}/${t.slug}`);
    });

    return { success: true, id: pageId };
  } catch (error) {
    console.error("Error upserting CMS page:", error);
    return { success: false, error: "Failed to save page" };
  }
}

export async function deleteCmsPage(id: string) {
  try {
    await prisma.cmsPage.delete({
      where: { id }
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting CMS page:", error);
    return { success: false, error: "Failed to delete page" };
  }
}
