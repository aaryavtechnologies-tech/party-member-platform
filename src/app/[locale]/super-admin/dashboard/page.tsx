import { prisma } from "@/lib/prisma";
import DashboardClient from "@/app/[locale]/admin/dashboard/DashboardClient";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { requireAdminAuth } from "@/lib/rbac";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Super Admin Dashboard | RAVP",
  description: "Super Admin control center for the RAVP platform",
};

export default async function SuperAdminDashboardPage() {
  const session = await requireAdminAuth();

  // Only SUPER_ADMIN can access this page
  if (session.role !== "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  // KPI Data
  const [totalMembers, activeLifetime, totalRevenueObj, openTickets] = await Promise.all([
    prisma.memberProfile.count(),
    prisma.memberProfile.count({ where: { membershipType: "LIFETIME_ACTIVE" } }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCESS" },
    }),
    prisma.supportTicket.count({
      where: { status: { in: ["OPEN", "IN_PROGRESS", "UNDER_REVIEW"] } },
    }),
  ]);

  const totalRevenue = totalRevenueObj._sum.amount || 0;

  // Monthly Charts Data (Last 6 Months)
  const monthlyRegistrations = [];
  const monthlyRevenue = [];

  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const monthName = format(date, "MMM");

    const memberCount = await prisma.memberProfile.count({
      where: { createdAt: { gte: start, lte: end } },
    });
    monthlyRegistrations.push({ name: monthName, members: memberCount });

    const revObj = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCESS", createdAt: { gte: start, lte: end } },
    });
    monthlyRevenue.push({ name: monthName, revenue: (revObj._sum.amount || 0) / 100 });
  }

  // Recent Activities
  const recentActivitiesRaw = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, action: true, details: true, createdAt: true },
  });

  const dashboardData = {
    totalMembers,
    activeLifetime,
    totalRevenue,
    openTickets,
    monthlyRegistrations,
    monthlyRevenue,
    recentActivities: recentActivitiesRaw,
  };

  return (
    <DashboardClient
      data={dashboardData}
      title="Super Admin Dashboard"
      subtitle="Full platform overview — all members, revenue, and activity across every region."
    />
  );
}
