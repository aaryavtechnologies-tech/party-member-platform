import { InnerPageHeader } from "@/components/layout/InnerPageHeader";

export default function FounderMessagePage() {
  return (
    <main>
      <InnerPageHeader 
        title="Founder's Message" 
        description="A direct address from our leadership on the future of our nation."
        breadcrumbs={[
          { label: "About Us", href: "/about" },
          { label: "Founder's Message", href: "/about/founder-message" }
        ]}
      />
      <div className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-4xl flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3 aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Placeholder for Founder Image */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold">Image</div>
          </div>
          <div className="w-full md:w-2/3 space-y-6 text-lg text-slate-700 dark:text-slate-300">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">A Pledge to the Nation</h2>
            <p>
              "When we began this journey, it was with a singular vision: to see a prosperous, united, and dominant nation. Today, that vision is closer than ever, but the final leap requires absolute dedication."
            </p>
            <p>
              "We do not promise miracles. We promise hard work, transparent governance, and policies that put the citizen first. Our strength is not in our leaders, but in our millions of dedicated workers and volunteers across the country."
            </p>
            <p className="font-bold text-slate-900 dark:text-white pt-4">
              - Party President
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
