import { InnerPageHeader } from "@/components/layout/InnerPageHeader";

export default function ObjectivesPage() {
  return (
    <main>
      <InnerPageHeader 
        title="Our Objectives" 
        description="Clear, measurable targets for national development."
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "Objectives", href: "/about/objectives" }
        ]}
      />
      <div className="py-32 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {[
              "Eradicate absolute poverty by 2030",
              "100% literacy rate across all states",
              "Universal healthcare coverage",
              "Net-zero carbon emissions by 2070",
              "Self-reliance in defense manufacturing",
              "Digital infrastructure in every village"
            ].map((obj, i) => (
              <div key={i} className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="text-primary font-bold text-xl mb-2">Objective {i+1}</div>
                <p className="text-slate-700 dark:text-slate-300 text-lg">{obj}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
