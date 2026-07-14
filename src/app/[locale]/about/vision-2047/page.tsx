import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { Vision } from "@/components/sections/Vision";

export default function Vision2047Page() {
  return (
    <main>
      <InnerPageHeader 
        title="Vision 2047" 
        description="Our comprehensive roadmap to transforming India into a developed nation by our 100th year of independence."
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "Vision 2047", href: "/about/vision-2047" }
        ]}
      />
      <div className="pt-20 pb-10 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-4xl text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-20">
          <p className="mb-6">
            Vision 2047 is not just a document; it is a solemn pledge to the people of this great nation. By the 100th anniversary of our independence, we envision a country that leads the world in innovation, sustainability, and human development.
          </p>
          <p>
            Through robust infrastructure development, deep investments in our youth, and a relentless commitment to transparent governance, we are laying the foundation for a golden era. This roadmap touches every sector—from agriculture and MSMEs to space exploration and global diplomacy.
          </p>
        </div>
      </div>
      <Vision />
    </main>
  );
}
