import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { useTranslations } from "next-intl";
import { CheckCircle2, Flag } from "lucide-react";

export default function JourneyPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("journeyPageContent");

  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("desc")}
        breadcrumbs={[
          { label: tNav("about"), href: "/about" },
          { label: t("title"), href: "/about/journey" }
        ]}
      />
      
      <div className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Intro Section */}
          <div className="text-center max-w-4xl mx-auto mb-20 space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">{t("heading")}</h1>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
            <div className="space-y-6 text-xl text-slate-700 dark:text-slate-300 leading-relaxed text-left bg-white dark:bg-slate-950 p-8 md:p-12 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p>{t("intro_p1")}</p>
              <p>{t("intro_p2")}</p>
              <p>{t("intro_p3")}</p>
              <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-2xl border-l-4 border-accent">
                <p className="font-bold text-primary text-2xl italic">{t("intro_p4")}</p>
              </div>
              <p>{t("intro_p5")}</p>
              <p>{t("intro_p6")}</p>
              <p>{t("intro_p7")}</p>
              <p>{t("intro_p8")}</p>
              <p>{t("intro_p9")}</p>
              <p className="font-bold text-primary text-center pt-4">{t("intro_p10")}</p>
            </div>
          </div>

          {/* Why Founded Section */}
          <div className="grid lg:grid-cols-2 gap-16 mb-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">{t("why_founded_title")}</h2>
              <h3 className="text-2xl text-slate-600 dark:text-slate-400 font-medium">{t("why_founded_subtitle")}</h3>
              <p className="text-2xl italic text-accent font-bold pb-4 border-b border-slate-200 dark:border-slate-700">{t("why_founded_slogan")}</p>
              <div className="space-y-4 text-lg text-slate-700 dark:text-slate-300">
                <p>{t("why_founded_p1")}</p>
                <p className="font-bold text-primary">{t("why_founded_p2")}</p>
                <p>{t("why_founded_p3")}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {t.raw("needs").slice(0, 4).map((need: { title: string; desc: string }, idx: number) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all group flex flex-col h-full">
                  <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">{need.title.replace(/^\d+\.\s*/, '')}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-auto">{need.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
              {t.raw("needs").slice(4).map((need: { title: string; desc: string }, idx: number) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all group flex flex-col h-full">
                  <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">{need.title.replace(/^\d+\.\s*/, '')}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-auto">{need.desc}</p>
                </div>
              ))}
          </div>

          {/* Ideology Section */}
          <div className="mb-24">
            <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
              <h2 className="text-4xl font-bold text-primary">{t("ideology_title")}</h2>
              <p className="text-2xl italic text-accent font-medium">{t("ideology_slogan")}</p>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">{t("ideology_p1")}</p>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">{t("ideology_p2")}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {t.raw("ideologies").map((item: { title: string; desc: string }, idx: number) => (
                <div key={idx} className="bg-white dark:bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary/30 transition-colors flex flex-col h-full group">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      {idx + 1}
                    </div>
                    <h3 className="text-xl font-bold text-primary leading-tight group-hover:text-accent transition-colors">
                      {item.title.replace(/^\d+\.\s*/, '')}
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-auto">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Resolutions & Slogans combined */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
            <div className="bg-primary text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <h2 className="text-3xl font-bold text-accent mb-8 relative z-10">{t("resolution_title")}</h2>
              <div className="space-y-4 text-lg mb-8 relative z-10 opacity-90">
                <p>{t("resolution_p1")}</p>
                <p>{t("resolution_p2")}</p>
              </div>
              <ul className="space-y-4 relative z-10">
                {t.raw("resolution_points").map((point: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-3 text-lg font-medium">
                    <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col gap-8">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-xl flex-grow">
                <h2 className="text-2xl font-bold text-primary mb-6">{t("final_resolution_title")}</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">{t("final_resolution_p1")}</p>
                <ul className="space-y-3">
                  {t.raw("final_resolutions").map((point: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-3 text-lg text-slate-700 dark:text-slate-300">
                      <Flag className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 md:p-10 border border-slate-200 dark:border-slate-700 text-center shadow-xl">
                <h3 className="text-lg font-bold text-slate-500 mb-6 tracking-widest uppercase">{t("final_slogan_title")}</h3>
                <div className="flex flex-col space-y-4 text-2xl font-bold text-primary">
                  {t.raw("final_slogans").map((slogan: string, idx: number) => (
                    <span key={idx} className="text-accent">{slogan}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center py-8">
             <h2 className="text-3xl font-bold text-primary mb-4">{t("final_message_title")}</h2>
             <p className="text-xl max-w-4xl mx-auto text-slate-600 dark:text-slate-400">{t("final_message_p1")}</p>
          </div>

        </div>
      </div>
    </main>
  );
}
