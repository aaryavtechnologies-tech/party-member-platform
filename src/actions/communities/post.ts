"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Member or Admin creates a new post in a community.
 */
export async function createCommunityPost(communityId: string, content: string, imageUrls: string[] = []) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  // Check if they are a member
  const memberProfile = await prisma.memberProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!memberProfile) throw new Error("Member profile not found");

  const community = await prisma.community.findUnique({
    where: { id: communityId },
    include: {
      members: { where: { memberProfileId: memberProfile.id } }
    }
  });

  if (!community) throw new Error("Community not found");
  
  if (!community.isPublic && community.members.length === 0 && community.createdById !== session.user.id) {
    throw new Error("You must be a member of this private community to post.");
  }

  const post = await prisma.communityPost.create({
    data: {
      communityId,
      authorId: memberProfile.id,
      authorType: "MEMBER",
      content,
      imageUrls
    }
  });

  revalidatePath(`/dashboard/communities/${communityId}`);
  return { success: true, post };
}

/**
 * Fetch chats with a basic polling action
 */
export async function getCommunityChats(communityId: string, limit = 50) {
  return prisma.communityChat.findMany({
    where: { communityId },
    orderBy: { createdAt: "asc" },
    take: limit,
    include: {
      // In a real app we'd join with the Member/Admin profiles to get names/avatars.
      // For now, we will just return raw data and fetch authors separately if needed,
      // or rely on a simple query structure.
    }
  });
}

/**
 * Send a chat message
 */
export async function sendCommunityChat(communityId: string, message: string, imageUrl?: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) throw new Error("Unauthorized");

  const memberProfile = await prisma.memberProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!memberProfile) throw new Error("Member profile not found");

  const chat = await prisma.communityChat.create({
    data: {
      communityId,
      authorId: memberProfile.id,
      authorType: "MEMBER",
      message,
      imageUrl
    }
  });

  // Revalidate to trigger server-components update (if using Server Components polling)
  revalidatePath(`/dashboard/communities/${communityId}`);
  return { success: true, chat };
}
