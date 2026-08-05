"use server";

import { prisma } from "@/lib/prisma";

// Utility to extract YouTube Video ID
function getYouTubeID(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export async function fetchVideoGallery() {
  try {
    // Fetch from News Media (where type is VIDEO)
    const newsMedia = await prisma.newsMedia.findMany({
      where: {
        type: "VIDEO",
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

    // Fetch Standalone Videos
    const standaloneVideos = await prisma.videoEntry.findMany({
      where: {
        status: "PUBLISHED"
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Normalize both sets into a unified gallery format
    const unifiedGallery = [];

    for (const nm of newsMedia) {
      if (!nm.media.url) continue;
      const title = nm.article.translations[0]?.title || "News Update";
      const ytId = getYouTubeID(nm.media.url);
      
      unifiedGallery.push({
        id: nm.id,
        url: nm.media.url,
        title: title,
        category: "News Event",
        source: "NEWS",
        thumbnail: ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null,
        date: nm.article.publishedAt || nm.article.createdAt
      });
    }

    for (const vid of standaloneVideos) {
      const ytId = getYouTubeID(vid.videoUrl);
      unifiedGallery.push({
        id: vid.id,
        url: vid.videoUrl,
        title: vid.title,
        category: vid.category,
        source: "STANDALONE",
        thumbnail: vid.thumbnailUrl || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null),
        date: vid.eventDate || vid.createdAt
      });
    }

    // Sort combined gallery by date descending
    unifiedGallery.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return unifiedGallery;
  } catch (error) {
    console.error("Failed to fetch video gallery:", error);
    return [];
  }
}
