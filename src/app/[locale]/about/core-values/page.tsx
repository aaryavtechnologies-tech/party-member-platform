import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { CoreValues as CoreValuesSection } from "@/components/sections/CoreValues";

export default function CoreValuesPage() {
  return (
    <main>
      <InnerPageHeader 
        title="Core Values" 
        description="The foundational principles that guide every decision, policy, and action we take."
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "Core Values", href: "/about/core-values" }
        ]}
      />
      <div className="pt-20">
        <CoreValuesSection />
      </div>
    </main>
  );
}
