import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { About as AboutSection } from "@/components/sections/About";
import { Vision } from "@/components/sections/Vision";
import { Mission } from "@/components/sections/Mission";
import { CoreValues } from "@/components/sections/CoreValues";

export default function AboutPage() {
  return (
    <main>
      <InnerPageHeader 
        title="About Us" 
        description="Learn about our history, our vision for a developed nation, and the core values that drive our movement forward."
        breadcrumbs={[{ label: "About Us", href: "/about" }]}
      />
      <div className="pt-20">
        <AboutSection />
      </div>
      <Vision />
      <Mission />
      <CoreValues />
    </main>
  );
}
