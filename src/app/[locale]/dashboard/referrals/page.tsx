import { getTranslations } from "next-intl/server";
import { Users, UserPlus, Award, Crown } from "lucide-react";
import { ReferralTable, ReferralData } from "./components/ReferralTable";
import { ReferralLinkGen } from "./components/ReferralLinkGen";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FeatureLock } from "@/components/shared/FeatureLock";
import { isMembershipActiveOrInGracePeriod } from "@/lib/membership-check";
import { formatMemberId } from "@/lib/utils";

export default async function ReferralsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Referral" });

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) {
    redirect("/membership/login");
  }

  const memberProfile = await prisma.memberProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: {
        include: {
          payments: {
            where: { status: "SUCCESS" }
          }
        }
      }
    }
  });

  if (!memberProfile) {
    redirect("/dashboard/membership");
  }

  // Check if member has paid or is within 30 days
  const hasSuccessfulPayment = memberProfile.user.payments.length > 0;
  const canAccess = isMembershipActiveOrInGracePeriod(memberProfile.createdAt, hasSuccessfulPayment);

  // Fetch referrals
  const referrals = await prisma.memberProfile.findMany({
    where: { referredById: memberProfile.id },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });

  const stats = {
    total: referrals.length,
    active: referrals.filter(r => r.status === "ACTIVE").length,
    lifetimePrimary: referrals.filter(r => r.membershipType === "LIFETIME_PRIMARY").length,
    lifetimeActive: referrals.filter(r => r.membershipType === "LIFETIME_ACTIVE").length
  };

  const tableData: ReferralData[] = referrals.map(r => ({
    id: formatMemberId(r.memberId),
    name: r.user.name,
    date: new Date(r.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    status: r.status,
    tier: r.membershipType
  }));

  return (
    <FeatureLock isPaidOrInGracePeriod={canAccess}>
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
              <StatCard title={t("Total Referred Members")} value={stats.total} icon={<Users className="w-6 h-6 text-blue-500" />} />
              <StatCard title={t("Active Members")} value={stats.active} icon={<UserPlus className="w-6 h-6 text-green-500" />} />
              <StatCard title={t("Lifetime Primary Members")} value={stats.lifetimePrimary} icon={<Award className="w-6 h-6 text-purple-500" />} />
              <StatCard title={t("Lifetime Active Members")} value={stats.lifetimeActive} icon={<Crown className="w-6 h-6 text-yellow-500" />} />
            </div>

            <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Referral History</h3>
              <ReferralTable data={tableData} />
            </div>
          </div>

          <div className="space-y-6">
            <ReferralLinkGen referralCode={memberProfile.referralCode} />
          </div>
        </div>
      </div>
    </FeatureLock>
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
