"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import { getCmsLocationFilter } from "@/lib/cms-rbac";
import { revalidatePath } from "next/cache";
import { sendAdminNotification } from "@/lib/notifications";
import { logAudit } from "@/lib/audit";

export async function getAdminComplaints() {
  const session = await requireAdminAuth();
  const locationFilter = getCmsLocationFilter(session);

  return prisma.supportTicket.findMany({
    where: locationFilter,
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function updateComplaintStatus(ticketId: string, status: string, resolutionMessage?: string) {
  const session = await requireAdminAuth();
  const locationFilter = getCmsLocationFilter(session);

  // Validate jurisdiction
  const ticket = await prisma.supportTicket.findFirst({
    where: {
      AND: [
        { id: ticketId },
        locationFilter
      ]
    }
  });

  if (!ticket) {
    throw new Error("Unauthorized: Complaint not found or outside jurisdiction");
  }

  const updated = await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { 
      status,
      assignedAdminId: (status === "ASSIGNED" || status === "IN_PROGRESS") ? session.id : ticket.assignedAdminId,
      resolvedAt: status === "RESOLVED" ? new Date() : ticket.resolvedAt,
      closedAt: status === "CLOSED" ? new Date() : ticket.closedAt,
    }
  });

  await logAudit(
    session.id,
    "UPDATE_COMPLAINT_STATUS",
    `Updated complaint ${ticket.ticketNumber} to ${status}. ${resolutionMessage ? 'Resolution attached.' : ''}`
  );

  if (status === "RESOLVED" || status === "CLOSED") {
    sendAdminNotification(
      session.id,
      "Complaint Closed",
      `Ticket ${ticket.ticketNumber} was successfully closed.`,
      "COMPLAINT_CLOSED",
      `/admin/complaints`
    ).catch(console.error);
  }

  revalidatePath("/admin/complaints");
  return updated;
}
