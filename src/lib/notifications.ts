import { prisma } from "@/lib/prisma";

/**
 * Creates an internal notification for an admin
 */
export async function sendAdminNotification(
  adminId: string,
  title: string,
  message: string,
  type: string,
  link?: string
) {
  try {
    return await prisma.adminNotification.create({
      data: {
        adminId,
        title,
        message,
        type,
        link
      }
    });
  } catch (error) {
    console.error("Failed to send admin notification", error);
    return null;
  }
}
