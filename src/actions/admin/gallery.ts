"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import { determineStatusOnSubmit, getCmsLocationFilter, canApproveContent } from "@/lib/cms-rbac";
import { ArticleStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ========================
// PHOTO GALLERY
// ========================

export async function getPhotoAlbums() {
  const session = await requireAdminAuth();
  const locationFilter = getCmsLocationFilter(session);

  return prisma.photoAlbum.findMany({
    where: locationFilter,
    include: {
      media: { include: { media: true } }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function createPhotoAlbum(data: any, requestedStatus: ArticleStatus) {
  const session = await requireAdminAuth();
  const finalStatus = determineStatusOnSubmit(session.role, requestedStatus, true);

  const album = await prisma.photoAlbum.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      eventDate: data.eventDate ? new Date(data.eventDate) : null,
      status: finalStatus,
      
      authorId: session.id,
      creatorRole: session.role,
      state: session.state,
      district: session.district,
      taluka: session.taluka,
      village: session.village,
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.id,
      action: "CREATE_PHOTO_ALBUM",
      details: `Created photo album: ${album.id} with status: ${finalStatus}`,
    }
  });

  revalidatePath("/admin/gallery/photos");
  return album;
}

export async function deletePhotoAlbum(albumId: string) {
  const session = await requireAdminAuth();
  const album = await prisma.photoAlbum.findUnique({ where: { id: albumId } });
  
  if (!album) throw new Error("Album not found");
  if (album.authorId !== session.id && session.role !== "SUPER_ADMIN" && !canApproveContent(session.role, album.creatorRole)) {
    throw new Error("Unauthorized");
  }

  await prisma.photoAlbum.delete({ where: { id: albumId } });
  revalidatePath("/admin/gallery/photos");
}

export async function addMediaToAlbum(albumId: string, mediaIds: string[]) {
  const session = await requireAdminAuth();
  
  const data = mediaIds.map(id => ({
    albumId,
    mediaId: id
  }));
  
  await prisma.photoAlbumMedia.createMany({
    data
  });
  
  revalidatePath(`/admin/gallery/photos/${albumId}`);
  return { success: true };
}

// ========================
// VIDEO GALLERY
// ========================

export async function getVideoEntries() {
  const session = await requireAdminAuth();
  const locationFilter = getCmsLocationFilter(session);

  return prisma.videoEntry.findMany({
    where: locationFilter,
    orderBy: { createdAt: "desc" }
  });
}

export async function createVideoEntry(data: any, requestedStatus: ArticleStatus) {
  const session = await requireAdminAuth();
  const finalStatus = determineStatusOnSubmit(session.role, requestedStatus, true);

  const video = await prisma.videoEntry.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      videoUrl: data.videoUrl,
      thumbnailUrl: data.thumbnailUrl,
      eventDate: data.eventDate ? new Date(data.eventDate) : null,
      status: finalStatus,
      
      authorId: session.id,
      creatorRole: session.role,
      state: session.state,
      district: session.district,
      taluka: session.taluka,
      village: session.village,
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.id,
      action: "CREATE_VIDEO_ENTRY",
      details: `Created video entry: ${video.id} with status: ${finalStatus}`,
    }
  });

  revalidatePath("/admin/gallery/videos");
  return video;
}

export async function deleteVideoEntry(videoId: string) {
  const session = await requireAdminAuth();
  const video = await prisma.videoEntry.findUnique({ where: { id: videoId } });
  
  if (!video) throw new Error("Video not found");
  if (video.authorId !== session.id && session.role !== "SUPER_ADMIN" && !canApproveContent(session.role, video.creatorRole)) {
    throw new Error("Unauthorized");
  }

  await prisma.videoEntry.delete({ where: { id: videoId } });
  revalidatePath("/admin/gallery/videos");
}
