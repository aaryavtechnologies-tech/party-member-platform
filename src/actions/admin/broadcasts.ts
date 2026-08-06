"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function sendBroadcast(data: {
  title: string;
  message: string;
  audience: "ALL" | "MEMBERS_ONLY" | "ADMINS_ONLY";
  type: string;
  link?: string;
}) {
  const session = await requireAdminAuth("STATE_ADMIN");

  const { title, message, audience, type, link } = data;

  if (!title || !message) {
    throw new Error("Title and message are required.");
  }

  // If sending to Admins or All
  if (audience === "ALL" || audience === "ADMINS_ONLY") {
    const admins = await prisma.admin.findMany({
      where: { isActive: true }
    });
    
    if (admins.length > 0) {
      const adminNotifications = admins.map(admin => ({
        adminId: admin.id,
        title,
        message,
        type,
        link
      }));
      
      await prisma.adminNotification.createMany({
        data: adminNotifications
      });
    }
  }

  // If sending to Members or All
  if (audience === "ALL" || audience === "MEMBERS_ONLY") {
    // In a real production app with 1M+ members, we would enqueue this to a background job worker (e.g. Inngest, BullMQ).
    // For now, we will create notifications directly for all active members.
    
    // For demo purposes, we limit to 10,000 members to prevent timeout, but ideally this is paginated/queued.
    const members = await prisma.memberProfile.findMany({
      select: { id: true },
      take: 10000 
    });

    if (members.length > 0) {
      const memberNotifications = members.map(member => ({
        memberId: member.id,
        title,
        message,
        type,
        link
      }));

      // Prisma createMany is efficient for bulk inserts
      await prisma.memberNotification.createMany({
        data: memberNotifications
      });
    }
  }

  revalidatePath("/admin/broadcasts");
  return { success: true };
}
