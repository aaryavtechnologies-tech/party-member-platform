import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { MembershipCTA } from "@/components/sections/MembershipCTA";

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
        <MembershipCTA />
      </div>
    </main>
  );
}
