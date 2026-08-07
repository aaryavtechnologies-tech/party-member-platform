"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function sendBroadcast(data: {
  title: string;
  message: string;
  audience: "ALL" | "ADMIN_ONLY" | "MEMBER_ONLY";
  imageUrl?: string;
  fileUrl?: string;
}) {
  const session = await requireAdminAuth("STATE_ADMIN");

  const { title, message, audience, imageUrl, fileUrl } = data;

  if (!title || !message) {
    throw new Error("Title and message are required.");
  }

  // Create global broadcast notification
  await prisma.broadcastNotification.create({
    data: {
      title,
      message,
      audience,
      imageUrl,
      fileUrl,
      authorId: session.id,
    }
  });

  revalidatePath("/admin/broadcasts");
  return { success: true };
}

export async function getAdminBroadcasts() {
  return prisma.broadcastNotification.findMany({
    where: {
      audience: { in: ["ALL", "ADMIN_ONLY"] }
    },
    orderBy: { createdAt: "desc" },
    take: 10
  });
}
