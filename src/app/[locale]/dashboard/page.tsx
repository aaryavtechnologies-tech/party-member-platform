import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, CreditCard, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardHome() {
  const t = await getTranslations("dashboard.home");
  const tMem = await getTranslations("Membership");

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) {
    redirect("/membership/login");
  }

  // Fetch Member Profile
  const memberProfile = await prisma.memberProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
    }
  });

  if (!memberProfile) {
    redirect("/dashboard/membership");
  }

  // Calculate Referrals
  const totalReferrals = await prisma.memberProfile.count({
    where: { referredById: memberProfile.id }
  });

  // Calculate Payments
  const payments = await prisma.payment.aggregate({
    where: { 
      userId: session.user.id,
      status: "SUCCESS"
    },
    _sum: {
      amount: true
    }
  });
  const totalPaymentsAmount = payments._sum.amount ? (payments._sum.amount / 100).toFixed(2) : "0";

  // Calculate Upcoming Events
  const upcomingEvents = await prisma.event.count({
    where: {
      date: {
        gt: new Date()
      }
    }
  });

  // Fetch Recent Activity (AuditLog)
  const recentActivities = await prisma.auditLog.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const formattedMembershipType = memberProfile.membershipType.replace("_", " ");

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 sm:p-10 text-slate-950 relative overflow-hidden shadow-xl shadow-primary/20">
        <div className="relative z-10">
          <p className="text-primary-foreground/80 font-semibold mb-2">{t("goodMorning")}</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">{t("welcomeBack", { name: memberProfile.user.name })}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <span className="bg-slate-950 text-white px-4 py-2 rounded-full font-bold text-sm shadow-sm">
              {tMem(formattedMembershipType + " Member")}
            </span>
            <span className="bg-white/30 backdrop-blur-md text-slate-950 border border-white/40 px-4 py-2 rounded-full font-bold text-sm shadow-sm">
              ID: {memberProfile.memberId}
            </span>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 blur-[50px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-white/10 blur-[50px] rounded-full -translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard title={t("status")} value={memberProfile.status} icon={ShieldCheck} />
        <StatsCard title={t("totalReferrals")} value={totalReferrals.toString()} icon={Users} trend={t("referralsTrend", { count: totalReferrals })} trendUp={totalReferrals > 0} />
        <StatsCard title={t("totalPayments")} value={`₹${totalPaymentsAmount}`} icon={CreditCard} />
        <StatsCard title={t("upcomingEvents")} value={upcomingEvents.toString()} icon={Activity} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t("recentActivity")}</h2>
            <Button variant="ghost" className="text-primary">{t("viewAll")}</Button>
          </div>
          <div className="space-y-6">
            {recentActivities.length > 0 ? recentActivities.map((act) => (
              <div key={act.id} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{act.action}</h4>
                  <p className="text-sm text-slate-500">
                    {new Date(act.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-slate-500 text-sm">No recent activity</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t("quickActions")}</h2>
          <div className="flex-1 space-y-4">
            {memberProfile.membershipType !== "LIFETIME_ACTIVE" && (
              <Link href="/dashboard/membership" className="flex items-center justify-between p-4 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{t("upgradeMembership")}</h4>
                  <p className="text-sm text-slate-500">{t("upgradeMembershipDesc")}</p>
                </div>
                <ShieldCheck className="w-6 h-6 text-primary" />
              </Link>
            )}
            
            <Link href="/dashboard/card" className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{t("digitalCardTitle")}</h4>
                <p className="text-sm text-slate-500">{t("digitalCardDesc")}</p>
              </div>
              <CreditCard className="w-6 h-6 text-slate-400" />
            </Link>

            <Link href="/dashboard/referrals" className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{t("inviteFriends")}</h4>
                <p className="text-sm text-slate-500">{t("inviteFriendsDesc")}</p>
              </div>
              <Users className="w-6 h-6 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
