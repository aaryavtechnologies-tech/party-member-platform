"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import { getCmsLocationFilter } from "@/lib/cms-rbac";
import { getMemberLocationFilter } from "@/lib/rbac";

export async function getDashboardAnalytics() {
  const session = await requireAdminAuth();
  
  // For Members we use getMemberLocationFilter
  const memberLocationFilter = getMemberLocationFilter(session);
  // For CMS/Events/Complaints we use getCmsLocationFilter
  const cmsLocationFilter = getCmsLocationFilter(session);

  const [
    totalMembers,
    pendingMembers,
    activeComplaints,
    upcomingEvents,
    recentMembers,
    recentNews
  ] = await Promise.all([
    // Total Members
    prisma.memberProfile.count({ where: memberLocationFilter }),
    // Pending Members
    prisma.memberProfile.count({ where: { ...memberLocationFilter, status: "PENDING_VERIFICATION" } }),
    // Active Complaints (Not CLOSED or RESOLVED)
    prisma.supportTicket.count({ 
      where: { 
        ...cmsLocationFilter, 
        status: { in: ["OPEN", "ASSIGNED", "IN_PROGRESS"] } 
      } 
    }),
    // Upcoming Events
    prisma.event.count({
      where: {
        ...cmsLocationFilter,
        date: { gte: new Date() }
      }
    }),
    // Recent Members (for Activity Timeline)
    prisma.memberProfile.findMany({
      where: memberLocationFilter,
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    // Recent News
    prisma.newsArticle.findMany({
      where: cmsLocationFilter,
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);

  return {
    kpis: {
      totalMembers,
      pendingMembers,
      activeComplaints,
      upcomingEvents
    },
    activity: {
      recentMembers,
      recentNews
    }
  };
}
