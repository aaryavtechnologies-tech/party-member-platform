import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { MembershipCTA } from "@/components/sections/MembershipCTA";
import { MembershipPricing } from "@/components/sections/MembershipPricing";
import { ReferralPromo } from "@/components/sections/ReferralPromo";

export default function MembershipPage() {
  return (
    <main>
      <InnerPageHeader 
        title="Membership" 
        description="Join millions of citizens working together to build a stronger, developed nation."
        breadcrumbs={[
          { label: "Membership", href: "/membership" }
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
