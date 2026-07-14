import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { Organization } from "@/components/sections/Organization";

export default function OrganizationStructurePage() {
  return (
    <main>
      <InnerPageHeader 
        title="Organizational Structure" 
        description="How we operate from the grassroots village committees up to the national leadership."
        breadcrumbs={[
          { label: "Organization", href: "/organization" },
          { label: "Structure", href: "/organization/structure" }
        ]}
      />
      <div className="pt-10">
        <Organization />
      </div>
    </main>
  );
}
