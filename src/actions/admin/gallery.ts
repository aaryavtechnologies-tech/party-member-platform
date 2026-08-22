"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import { determineStatusOnSubmit, getCmsLocationFilter, canApproveContent } from "@/lib/cms-rbac";
import { ArticleStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

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
      category: data.category || "General",
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

  await logAudit(
    session.id,
    "CREATE_PHOTO_ALBUM",
    `Created photo album: ${album.id} with status: ${finalStatus}`
  );

  revalidatePath("/admin/gallery");
  revalidatePath("/admin/gallery/photos");
  return album;
}

export async function createPhotoAlbumWithImages(data: {
  title: string;
  description?: string;
  category?: string;
  eventDate?: string;
  imageUrls?: string[];
  status?: ArticleStatus;
}) {
  const session = await requireAdminAuth();
  const requestedStatus = data.status || "PUBLISHED";
  const finalStatus = determineStatusOnSubmit(session.role, requestedStatus, true);

  const album = await prisma.photoAlbum.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category || "General",
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

  if (data.imageUrls && data.imageUrls.length > 0) {
    for (let i = 0; i < data.imageUrls.length; i++) {
      const url = data.imageUrls[i];
      const rawName = url.split("/").pop() || `photo_${i}.webp`;
      const uniqueFilename = `${album.id}_${i}_${rawName}`;
      
      const media = await prisma.mediaFile.create({
        data: {
          filename: uniqueFilename,
          originalName: rawName,
          url: url,
          mimeType: "image/webp",
          size: 0,
          folder: "gallery",
          uploaderId: session.id,
          uploaderRole: session.role,
          state: session.state,
          district: session.district,
        }
      });

      await prisma.photoAlbumMedia.create({
        data: {
          albumId: album.id,
          mediaId: media.id,
          order: i,
        }
      });
    }
  }

  await logAudit(
    session.id,
    "CREATE_PHOTO_ALBUM",
    `Created photo album: ${album.id} with status: ${finalStatus}`
  );

  revalidatePath("/admin/gallery");
  revalidatePath("/admin/gallery/photos");
  return album;
}

export async function approvePhotoAlbum(albumId: string) {
  const session = await requireAdminAuth();
  const album = await prisma.photoAlbum.findUnique({ where: { id: albumId } });
  if (!album) throw new Error("Album not found");

  if (!canApproveContent(session.role, album.creatorRole)) {
    throw new Error("Unauthorized to approve this content.");
  }

  const updated = await prisma.photoAlbum.update({
    where: { id: albumId },
    data: { status: "PUBLISHED" }
  });

  await logAudit(
    session.id,
    "APPROVE_PHOTO_ALBUM",
    `Approved photo album: ${album.id}`
  );

  revalidatePath("/admin/gallery");
  revalidatePath("/admin/gallery/photos");
  return updated;
}

export async function deletePhotoAlbum(albumId: string) {
  const session = await requireAdminAuth();
  const album = await prisma.photoAlbum.findUnique({ where: { id: albumId } });
  
  if (!album) throw new Error("Album not found");
  if (album.authorId !== session.id && session.role !== "SUPER_ADMIN" && !canApproveContent(session.role, album.creatorRole)) {
    throw new Error("Unauthorized");
  }

  await prisma.photoAlbum.delete({ where: { id: albumId } });
  revalidatePath("/admin/gallery");
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

export async function createVideoEntry(data: any, requestedStatus: ArticleStatus = "PUBLISHED") {
  const session = await requireAdminAuth();
  const finalStatus = determineStatusOnSubmit(session.role, requestedStatus, true);

  const video = await prisma.videoEntry.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category || "General",
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

  await logAudit(
    session.id,
    "CREATE_VIDEO_ENTRY",
    `Created video entry: ${video.id} with status: ${finalStatus}`
  );

  revalidatePath("/admin/gallery");
  revalidatePath("/admin/gallery/videos");
  return video;
}

export async function approveVideoEntry(videoId: string) {
  const session = await requireAdminAuth();
  const video = await prisma.videoEntry.findUnique({ where: { id: videoId } });
  if (!video) throw new Error("Video not found");

  if (!canApproveContent(session.role, video.creatorRole)) {
    throw new Error("Unauthorized to approve this content.");
  }

  const updated = await prisma.videoEntry.update({
    where: { id: videoId },
    data: { status: "PUBLISHED" }
  });

  await logAudit(
    session.id,
    "APPROVE_VIDEO_ENTRY",
    `Approved video entry: ${video.id}`
  );

  revalidatePath("/admin/gallery");
  revalidatePath("/admin/gallery/videos");
  return updated;
}

export async function deleteVideoEntry(videoId: string) {
  const session = await requireAdminAuth();
  const video = await prisma.videoEntry.findUnique({ where: { id: videoId } });
  
  if (!video) throw new Error("Video not found");
  if (video.authorId !== session.id && session.role !== "SUPER_ADMIN" && !canApproveContent(session.role, video.creatorRole)) {
    throw new Error("Unauthorized");
  }

  await prisma.videoEntry.delete({ where: { id: videoId } });
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/gallery/videos");
}
