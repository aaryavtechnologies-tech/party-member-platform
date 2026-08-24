import { requireAdminAuth } from "@/lib/rbac";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AnalyticsClientWrapper } from "@/components/admin/AnalyticsClientWrapper";
import { prisma } from "@/lib/prisma";

export default async function AnalyticsOverviewPage() {
  await requireAdminAuth();

  // Run database aggregations concurrently
  const [
    totalMembers,
    activeMembers,
    pendingMembers,
    totalPaymentsAgg,
    membersByTierRaw,
    membersByStatusRaw,
  ] = await Promise.all([
    prisma.memberProfile.count(),
    prisma.memberProfile.count({ where: { status: "ACTIVE" } }),
    prisma.memberProfile.count({ where: { status: "PENDING_VERIFICATION" } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "SUCCESS" } }),
    prisma.memberProfile.groupBy({
      by: ["membershipType"],
      _count: { id: true },
    }),
    prisma.memberProfile.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  // Convert paise to rupees
  const totalRevenue = (totalPaymentsAgg._sum.amount || 0) / 100;

  // Format groupings for Recharts
  const membersByTier = membersByTierRaw.map((t) => ({
    name: t.membershipType.replace(/_/g, " "),
    value: t._count.id,
  }));

  const membersByStatus = membersByStatusRaw.map((s) => ({
    name: s.status.replace(/_/g, " "),
    value: s._count.id,
  }));

  const analyticsData = {
    totalMembers,
    activeMembers,
    pendingMembers,
    totalRevenue,
    membersByTier,
    membersByStatus,
  };

  return (
    <div className="flex flex-col h-full space-y-6 p-6">
      <AdminBreadcrumbs />
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Analytics Overview</h1>
        <p className="text-slate-500 mt-1">Live metrics and platform performance.</p>
      </div>
      
      <AnalyticsClientWrapper data={analyticsData} />
    </div>
  );
}
