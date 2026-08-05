"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import { getCmsLocationFilter } from "@/lib/cms-rbac";
import { revalidatePath } from "next/cache";

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

  await prisma.auditLog.create({
    data: {
      userId: session.id,
      action: "CREATE_EVENT",
      details: `Created event ${event.title}`,
    }
  });

  revalidatePath("/admin/events");
  return event;
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
  revalidatePath("/admin/events");
}
