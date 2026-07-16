import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { MembershipCTA } from "@/components/sections/MembershipCTA";
import { MembershipPricing } from "@/components/sections/MembershipPricing";
import { ReferralPromo } from "@/components/sections/ReferralPromo";
import { useTranslations } from "next-intl";

export default function MembershipPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("MembershipPage");
  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("desc")}
        breadcrumbs={[
          { label: tNav("membership"), href: "/membership" }
        ]}
      />
      <div className="pt-10">
        <MembershipPricing />
        <ReferralPromo />
        <MembershipCTA />
      </div>
    </main>
  );
}
