import { prisma } from "@/lib/prisma";

/**
 * Safely writes an audit log without failing the transaction/action
 * if the performing admin does not have a matching record in the public User table.
 */
export async function logAudit(userId: string, action: string, details: string) {
  try {
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (userExists) {
      await prisma.auditLog.create({
        data: {
          userId,
          action,
          details,
          result: "SUCCESS",
        },
      });
    } else {
      console.log(`[Admin Audit] Admin (${userId}) executed ${action}: ${details}`);
    }
  } catch (err) {
    console.warn(`[AuditLog Warning] Could not persist audit log for action "${action}":`, err);
  }
}
