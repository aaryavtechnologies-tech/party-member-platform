import { InnerPageHeader } from "@/components/layout/InnerPageHeader";

export default function JourneyPage() {
  return (
    <main>
      <InnerPageHeader 
        title="Our Journey" 
        description="A timeline of our struggle, triumphs, and unwavering dedication to the people."
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "Our Journey", href: "/about/journey" }
        ]}
      />
      <div className="py-32 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-4xl text-center text-slate-600 dark:text-slate-400">
          <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">A History of Service</h2>
          <p className="text-xl mb-12">From grassroots movements to national leadership, our journey has always been powered by the people.</p>
          
          <div className="bg-slate-50 dark:bg-slate-900 p-12 rounded-3xl border border-slate-100 dark:border-slate-800">
            <p className="italic">Detailed historical timeline and interactive journey map will be rendered here, highlighting key milestones, election victories, and major policy implementations over the decades.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
