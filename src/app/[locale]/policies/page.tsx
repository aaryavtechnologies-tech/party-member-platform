import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { Policies } from "@/components/sections/Policies";

export default function PoliciesPage() {
  return (
    <main>
      <InnerPageHeader 
        title="National Policies" 
        description="Comprehensive frameworks designed to foster growth, ensure equity, and protect our future."
        breadcrumbs={[
          { label: "Policies", href: "/policies" }
        ]}
      />
      <div className="pt-10">
        <Policies />
      </div>
    </main>
  );
}
