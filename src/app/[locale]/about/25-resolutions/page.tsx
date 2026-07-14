import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { Resolutions } from "@/components/sections/Resolutions";

export default function ResolutionsPage() {
  return (
    <main>
      <InnerPageHeader 
        title="25 Resolutions" 
        description="Our comprehensive 25-point agenda to secure, develop, and elevate the nation on the global stage."
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "25 Resolutions", href: "/about/25-resolutions" }
        ]}
      />
      <div className="pt-20">
        <Resolutions />
      </div>
    </main>
  );
}
