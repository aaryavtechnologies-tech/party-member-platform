import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { FAQ } from "@/components/sections/FAQ";

export default function FAQPage() {
  return (
    <main>
      <InnerPageHeader 
        title="Frequently Asked Questions" 
        description="Find answers to common questions about our policies, membership, and organization structure."
        breadcrumbs={[
          { label: "FAQ", href: "/faq" }
        ]}
      />
      <div className="pt-10">
        <FAQ />
      </div>
    </main>
  );
}
