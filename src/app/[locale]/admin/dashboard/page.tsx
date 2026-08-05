import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

import { requireAdminAuth, getMemberLocationFilter } from "@/lib/rbac";

export default async function AdminDashboardPage() {
  const session = await requireAdminAuth();
  const locationFilter = getMemberLocationFilter(session);

  // 1. KPI Data
  const [totalMembers, activeLifetime, totalRevenueObj, openTickets] = await Promise.all([
    prisma.memberProfile.count({
      where: locationFilter
    }),
    prisma.memberProfile.count({
      where: { ...locationFilter, membershipType: "LIFETIME_ACTIVE" }
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCESS" } // Assuming payments are global or we need to filter via user relation
    }),
    prisma.supportTicket.count({
      where: { status: { in: ["OPEN", "IN_PROGRESS", "UNDER_REVIEW"] } }
    })
  ]);

  const totalRevenue = totalRevenueObj._sum.amount || 0;

  // 2. Monthly Charts Data (Last 6 Months)
  const monthlyRegistrations = [];
  const monthlyRevenue = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const monthName = format(date, 'MMM');

    // Registrations for the month
    const memberCount = await prisma.memberProfile.count({
      where: {
        ...locationFilter,
        createdAt: { gte: start, lte: end }
      }
    });
    monthlyRegistrations.push({ name: monthName, members: memberCount });

    // Revenue for the month
    const revObj = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { 
        status: "SUCCESS",
        createdAt: { gte: start, lte: end }
      }
    });
    // Convert paise to rupees for the chart
    monthlyRevenue.push({ name: monthName, revenue: (revObj._sum.amount || 0) / 100 });
  }

  // 3. Recent Activities (from AuditLog)
  const recentActivitiesRaw = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      action: true,
      details: true,
      createdAt: true
    }
  });

  const dashboardData = {
    totalMembers,
    activeLifetime,
    totalRevenue,
    openTickets,
    monthlyRegistrations,
    monthlyRevenue,
    recentActivities: recentActivitiesRaw
  };

  return <DashboardClient data={dashboardData} />;
}
