"use server";

import { prisma } from "@/lib/prisma";

export async function fetchPhotoGallery() {
  try {
    // Fetch from News Media (where type is GALLERY_IMAGE or FEATURED_IMAGE)
    const newsMedia = await prisma.newsMedia.findMany({
      where: {
        type: {
          in: ["GALLERY_IMAGE", "FEATURED_IMAGE"]
        },
        article: {
          status: "PUBLISHED"
        }
      },
      include: {
        media: true,
        article: {
          include: {
            translations: {
              where: { language: "en" }
            }
          }
        }
      },
      orderBy: {
        article: {
          publishedAt: 'desc'
        }
      }
    });

    // Fetch from Standalone Photo Albums
    const albumMedia = await prisma.photoAlbumMedia.findMany({
      where: {
        album: {
          status: "PUBLISHED"
        }
      },
      include: {
        media: true,
        album: true
      },
      orderBy: {
        album: {
          createdAt: 'desc'
        }
      }
    });

    // Normalize both sets into a unified gallery format
    const unifiedGallery = [];

    for (const nm of newsMedia) {
      if (!nm.media.url) continue;
      const title = nm.article.translations[0]?.title || "News Update";
      unifiedGallery.push({
        id: nm.id,
        url: nm.media.url,
        title: title,
        category: "News Event",
        source: "NEWS",
        date: nm.article.publishedAt || nm.article.createdAt
      });
    }

    for (const am of albumMedia) {
      if (!am.media.url) continue;
      unifiedGallery.push({
        id: am.id,
        url: am.media.url,
        title: am.album.title,
        category: am.album.category,
        source: "ALBUM",
        date: am.album.eventDate || am.album.createdAt
      });
    }

    // Sort combined gallery by date descending
    unifiedGallery.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return unifiedGallery;
  } catch (error) {
    console.error("Failed to fetch photo gallery:", error);
    return [];
  }
}
