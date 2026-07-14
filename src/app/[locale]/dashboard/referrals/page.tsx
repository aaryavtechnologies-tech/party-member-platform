import { getTranslations } from "next-intl/server";
import { Users, UserPlus, Award, Crown } from "lucide-react";
import { ReferralStats } from "./components/ReferralStats";
import { ReferralTable } from "./components/ReferralTable";
import { ReferralLinkGen } from "./components/ReferralLinkGen";

export default async function ReferralsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Referral" });

  // Dummy data for now. In a real app, fetch from Prisma where referrerId = currentUser
  const dummyStats = {
    total: 124,
    active: 98,
    lifetimePrimary: 45,
    lifetimeActive: 12
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="text-slate-500">
          Monitor your referral network and track your progress.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <StatCard title={t("Total Referred Members")} value={dummyStats.total} icon={<Users className="w-6 h-6 text-blue-500" />} />
            <StatCard title={t("Active Members")} value={dummyStats.active} icon={<UserPlus className="w-6 h-6 text-green-500" />} />
            <StatCard title={t("Lifetime Primary Members")} value={dummyStats.lifetimePrimary} icon={<Award className="w-6 h-6 text-purple-500" />} />
            <StatCard title={t("Lifetime Active Members")} value={dummyStats.lifetimeActive} icon={<Crown className="w-6 h-6 text-yellow-500" />} />
          </div>

          <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Referral History</h3>
            <ReferralTable />
          </div>
        </div>

        <div className="space-y-6">
          <ReferralLinkGen referralCode="RAVP458963" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-500 line-clamp-1" title={title}>{title}</div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      </div>
    </div>
  );
}
