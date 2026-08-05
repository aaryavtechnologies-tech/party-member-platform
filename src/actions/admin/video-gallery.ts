"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getVideoEntries() {
  return await prisma.videoEntry.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createVideoEntry(data: { 
  title: string, 
  description?: string, 
  category: string, 
  videoUrl: string,
  thumbnailUrl?: string,
  eventDate?: Date 
}) {
  try {
    const video = await prisma.videoEntry.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category || "General",
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl,
        eventDate: data.eventDate,
        status: "PUBLISHED"
      }
    });
    revalidatePath("/admin/media/videos");
    revalidatePath("/media/video-gallery");
    return { success: true, videoId: video.id };
  } catch (error) {
    console.error("Failed to create video entry:", error);
    return { success: false, error: "Failed to create video entry" };
  }
}

export async function deleteVideoEntry(id: string) {
  try {
    await prisma.videoEntry.delete({
      where: { id }
    });
    revalidatePath("/admin/media/videos");
    revalidatePath("/media/video-gallery");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete video entry:", error);
    return { success: false, error: "Failed to delete video entry" };
  }
}
