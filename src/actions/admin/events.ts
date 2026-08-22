"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import { getCmsLocationFilter } from "@/lib/cms-rbac";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

export async function getAdminEvents() {
  const session = await requireAdminAuth();
  const locationFilter = getCmsLocationFilter(session);

  return prisma.event.findMany({
    where: locationFilter,
    include: {
      _count: {
        select: { registrations: true }
      }
    },
    orderBy: { date: "desc" }
  });
}

export async function createAdminEvent(data: any) {
  const session = await requireAdminAuth();
  
  const event = await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      venue: data.venue,
      location: `${data.venue}, ${session.district}, ${session.state}`,
      imageUrl: data.imageUrl,
      organizer: data.organizer,
      registrationRequired: data.registrationRequired === "true" || data.registrationRequired === true,
      maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : null,
      contactPerson: data.contactPerson,
      status: data.status || "PUBLISHED",
      
      // Auto-assign LBAC fields based on the creator's role
      country: "India",
      state: session.state,
      district: session.district,
      taluka: session.taluka,
      village: session.village,
    }
  });

  await logAudit(
    session.id,
    "CREATE_EVENT",
    `Created event ${event.title}`
  );

  revalidatePath("/admin/events");
  return event;
}

export async function getAdminEventById(eventId: string) {
  const session = await requireAdminAuth();
  const locationFilter = getCmsLocationFilter(session);

  const event = await prisma.event.findFirst({
    where: {
      AND: [
        { id: eventId },
        locationFilter
      ]
    },
    include: {
      _count: {
        select: { registrations: true }
      }
    }
  });

  return event;
}

export async function updateAdminEvent(eventId: string, data: any) {
  const session = await requireAdminAuth();
  const locationFilter = getCmsLocationFilter(session);

  const existing = await prisma.event.findFirst({
    where: {
      AND: [
        { id: eventId },
        locationFilter
      ]
    }
  });

  if (!existing) {
    throw new Error("Unauthorized: Event not found or outside jurisdiction");
  }

  const updated = await prisma.event.update({
    where: { id: eventId },
    data: {
      title: data.title !== undefined ? data.title : existing.title,
      description: data.description !== undefined ? data.description : existing.description,
      date: data.date ? new Date(data.date) : existing.date,
      startTime: data.startTime !== undefined ? data.startTime : existing.startTime,
      endTime: data.endTime !== undefined ? data.endTime : existing.endTime,
      venue: data.venue !== undefined ? data.venue : existing.venue,
      location: data.venue ? `${data.venue}, ${session.district || ""}, ${session.state || ""}` : existing.location,
      imageUrl: data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl,
      organizer: data.organizer !== undefined ? data.organizer : existing.organizer,
      registrationRequired: data.registrationRequired !== undefined ? (data.registrationRequired === "true" || data.registrationRequired === true) : existing.registrationRequired,
      maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : (data.maxParticipants === "" ? null : existing.maxParticipants),
      contactPerson: data.contactPerson !== undefined ? data.contactPerson : existing.contactPerson,
      status: data.status || existing.status,
    }
  });

  await logAudit(
    session.id,
    "UPDATE_EVENT",
    `Updated event: ${updated.title} (${eventId})`
  );

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/edit/${eventId}`);
  return updated;
}

export async function deleteAdminEvent(eventId: string) {
  const session = await requireAdminAuth();
  const locationFilter = getCmsLocationFilter(session);

  // Validate jurisdiction
  const event = await prisma.event.findFirst({
    where: {
      AND: [
        { id: eventId },
        locationFilter
      ]
    }
  });

  if (!event) {
    throw new Error("Unauthorized: Event not found or outside jurisdiction");
  }

  await prisma.event.delete({ where: { id: eventId } });

  await logAudit(
    session.id,
    "DELETE_EVENT",
    `Deleted event: ${event.title} (${eventId})`
  );

  revalidatePath("/admin/events");
  return { success: true };
}
