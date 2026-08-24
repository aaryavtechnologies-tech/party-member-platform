import { requireAdminAuth } from "@/lib/rbac";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { prisma } from "@/lib/prisma";
import ReferralsClientWrapper from "@/components/admin/ReferralsClientWrapper";

export const dynamic = 'force-dynamic';

export default async function ReferralReportsPage() {
  await requireAdminAuth();

  // 1. Total Referrals
  const totalReferrals = await prisma.referralHistory.count();

  // 2. Active Promoters (Distinct Referrers)
  const distinctReferrers = await prisma.referralHistory.findMany({
    distinct: ['referrerId'],
    select: { referrerId: true }
  });
  const activePromoters = distinctReferrers.length;

  // 3. Conversion Rate
  const successfulReferrals = await prisma.referralHistory.count({ where: { status: "SUCCESS" } });
  const conversionRate = totalReferrals > 0 ? ((successfulReferrals / totalReferrals) * 100).toFixed(1) : "0.0";

  // 4. Status Distribution (Pie Chart)
  const statusDistributionRaw = await prisma.referralHistory.groupBy({
    by: ['status'],
    _count: true
  });
  const statusDistribution = statusDistributionRaw.map(s => ({
    name: s.status,
    value: s._count
  }));

  // 5. Monthly Trend (Line/Bar Chart)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const recentReferrals = await prisma.referralHistory.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true }
  });

  const monthlyTrend = Array.from({length: 6}).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const monthName = d.toLocaleString('default', { month: 'short' });
    const count = recentReferrals.filter(r => 
      r.createdAt.getMonth() === d.getMonth() && 
      r.createdAt.getFullYear() === d.getFullYear()
    ).length;
    return { name: monthName, value: count };
  });

  // 6. Top Referrers Leaderboard
  const topReferrersData = await prisma.referralHistory.groupBy({
    by: ['referrerId'],
    _count: { referredId: true },
    orderBy: { _count: { referredId: 'desc' } },
    take: 5
  });

  let topReferrers: any[] = [];
  if (topReferrersData.length > 0) {
    const referrersDetails = await prisma.memberProfile.findMany({
      where: { id: { in: topReferrersData.map(r => r.referrerId) } },
      include: { user: { select: { name: true, image: true } } }
    });

    topReferrers = topReferrersData.map(r => {
      const details = referrersDetails.find(d => d.id === r.referrerId);
      return {
        id: r.referrerId,
        count: r._count.referredId,
        name: details?.user?.name || "Unknown Member",
        image: details?.user?.image || null
      };
    });
  }

  return (
    <div className="flex flex-col h-full space-y-6 p-6 max-w-7xl mx-auto">
      <AdminBreadcrumbs />
      <div className="pb-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Referral Reports</h1>
        <p className="text-slate-500">Track and monitor membership referral performance.</p>
      </div>
      
      <ReferralsClientWrapper 
        totalReferrals={totalReferrals}
        activePromoters={activePromoters}
        conversionRate={conversionRate}
        statusDistribution={statusDistribution}
        monthlyTrend={monthlyTrend}
        topReferrers={topReferrers}
      />
    </div>
  );
}
