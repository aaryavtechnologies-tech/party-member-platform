import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, CreditCard, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function DashboardHome() {
  const t = useTranslations("dashboard.home");
  const tMem = useTranslations("Membership");
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 sm:p-10 text-slate-950 relative overflow-hidden shadow-xl shadow-primary/20">
        <div className="relative z-10">
          <p className="text-primary-foreground/80 font-semibold mb-2">{t("goodMorning")}</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">{t("welcomeBack", { name: "Himanshu" })}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <span className="bg-slate-950 text-white px-4 py-2 rounded-full font-bold text-sm shadow-sm">
              {tMem("Lifetime Primary Member")}
            </span>
            <span className="bg-white/30 backdrop-blur-md text-slate-950 border border-white/40 px-4 py-2 rounded-full font-bold text-sm shadow-sm">
              ID: RAVP000245
            </span>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 blur-[50px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-white/10 blur-[50px] rounded-full -translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard title={t("status")} value={t("statusActive")} icon={ShieldCheck} />
        <StatsCard title={t("totalReferrals")} value="12" icon={Users} trend={t("referralsTrend", { count: 3 })} trendUp={true} />
        <StatsCard title={t("totalPayments")} value="₹100" icon={CreditCard} />
        <StatsCard title={t("upcomingEvents")} value="2" icon={Activity} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t("recentActivity")}</h2>
            <Button variant="ghost" className="text-primary">{t("viewAll")}</Button>
          </div>
          <div className="space-y-6">
            {[
              { title: t("activities.login", { device: "Chrome (Mac)" }), date: "Today, 10:45 AM" },
              { title: t("activities.download"), date: "Yesterday, 2:30 PM" },
              { title: t("activities.upgrade"), date: "Oct 12, 2024" },
            ].map((act, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{act.title}</h4>
                  <p className="text-sm text-slate-500">{act.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t("quickActions")}</h2>
          <div className="flex-1 space-y-4">
            <Link href="/dashboard/membership" className="flex items-center justify-between p-4 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{t("upgradeMembership")}</h4>
                <p className="text-sm text-slate-500">{t("upgradeMembershipDesc")}</p>
              </div>
              <ShieldCheck className="w-6 h-6 text-primary" />
            </Link>
            
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
