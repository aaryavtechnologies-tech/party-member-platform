import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { Organization as OrgSection } from "@/components/sections/Organization";

export default function OrganizationPage() {
  return (
    <main>
      <InnerPageHeader 
        title="Our Organization" 
        description="A robust, democratic, and deeply connected structure reaching every corner of the nation."
        breadcrumbs={[
          { label: "Organization", href: "/organization" }
        ]}
      />
      <div className="pt-10">
        <OrgSection />
      </div>
    </main>
  );
}
