import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { Mission as MissionSection } from "@/components/sections/Mission";

export default function MissionPage() {
  return (
    <main>
      <InnerPageHeader 
        title="Our Mission" 
        description="Empowering every citizen through equitable growth, uncompromising security, and technological advancement."
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "Our Mission", href: "/about/mission" }
        ]}
      />
      <MissionSection />
      
      <div className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Action Plan & Execution</h2>
          <div className="space-y-8 text-lg text-slate-600 dark:text-slate-400">
            <p>
              Our mission goes beyond promises. We operate on strict, measurable action plans designed to create immediate and long-term impact. We believe that true development is visible, accessible, and measurable at the grassroots level.
            </p>
            <ul className="list-disc pl-6 space-y-4 text-slate-700 dark:text-slate-300">
              <li><strong>Zero Tolerance for Corruption:</strong> Implementing absolute digital transparency in all government contracts and public spending.</li>
              <li><strong>Last-Mile Delivery:</strong> Ensuring that welfare schemes reach the most vulnerable citizens without bureaucratic friction.</li>
              <li><strong>Economic Sovereignty:</strong> Boosting local manufacturing to reduce import dependency and create millions of jobs.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
