import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { useTranslations } from "next-intl";
import { CheckCircle2, Star, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("aboutPageContent");

  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("desc")}
        breadcrumbs={[{ label: t("title"), href: "/about" }]}
      />
      <div className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header Section */}
          <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight">{t("heading")}</h1>
            <p className="text-2xl md:text-3xl italic text-accent font-medium">{t("slogan")}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            {/* Intro Section */}
            <div className="space-y-6 text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="text-xl font-medium text-slate-900 dark:text-white border-l-4 border-primary pl-4">{t("intro_p1")}</p>
              <p>{t("intro_p2")}</p>
              <p>{t("intro_p3")}</p>
            </div>
            
            {/* Belief Section */}
            <div className="bg-white dark:bg-slate-950 p-8 md:p-12 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden group hover:border-primary/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
              <h2 className="text-3xl font-bold text-primary mb-3 relative z-10">{t("belief_title")}</h2>
              <p className="text-lg text-slate-500 mb-8 font-medium relative z-10">{t("belief_desc")}</p>
              <ul className="space-y-4 relative z-10">
                {t.raw("beliefs").map((belief: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-3 text-lg text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <span>{belief}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 mb-24">
            {/* Dream Section */}
            <div className="bg-primary text-white p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mb-32"></div>
              <h2 className="text-3xl font-bold text-accent mb-3 relative z-10">{t("dream_title")}</h2>
              <p className="text-lg opacity-90 mb-8 relative z-10">{t("dream_desc")}</p>
              <ul className="space-y-4 relative z-10">
                {t.raw("dreams").map((dream: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-3 text-lg">
                    <Star className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <span>{dream}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Values Section */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-primary mb-4">{t("values_title")}</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">{t("values_desc")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t.raw("values").map((value: string, idx: number) => (
                  <div key={idx} className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                    <ShieldCheck className="w-5 h-5 text-accent" />
                    <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto space-y-16">
            {/* Resolution Section */}
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-primary mb-8 relative inline-block">
                {t("resolution_title")}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-accent rounded-full"></div>
              </h2>
              <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed">{t("resolution_p1")}</p>
              <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed">{t("resolution_p2")}</p>
            </div>

            {/* Invitation Section */}
            <div className="bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-slate-950 p-10 md:p-16 rounded-[3rem] border border-slate-200 dark:border-slate-800 text-center shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">{t("invitation_title")}</h2>
              <div className="space-y-8 text-xl max-w-4xl mx-auto text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>{t("invitation_p1")}</p>
                <p className="font-bold text-2xl text-accent pb-4 border-b border-slate-200 dark:border-slate-800 inline-block px-8">{t("invitation_p2")}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
