import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { useTranslations } from "next-intl";

export default function FounderMessagePage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("founderMessageContent");

  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("desc")}
        breadcrumbs={[
          { label: tNav("about"), href: "/about" },
          { label: t("title"), href: "/about/founder-message" }
        ]}
      />
      <div className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row gap-16 items-start">
          {/* Left Column: Photo & Signature */}
          <div className="w-full md:w-1/3 flex flex-col items-center space-y-6 sticky top-24">
            <div className="w-full aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl relative border-4 border-white dark:border-slate-800">
              {/* Professional Photo Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 font-medium p-6 text-center z-20">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                [Professional Photo in Suit]
              </div>
            </div>
            
            <div className="text-center w-full bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800">
              {/* Digital Signature Placeholder */}
              <div className="h-16 w-full flex items-center justify-center border-b border-dashed border-slate-300 dark:border-slate-700 mb-4 pb-2">
                <span className="font-serif text-3xl text-slate-700 dark:text-slate-300 italic opacity-80" style={{ fontFamily: "cursive" }}>
                  {t("founder_name_sign")}
                </span>
              </div>
              <h3 className="font-bold text-xl text-primary">{t("founder_name")}</h3>
              <p className="text-accent font-medium">{t("founder_title")}</p>
              <p className="text-slate-500 text-sm mt-1">{t("party_name")}</p>
            </div>
          </div>

          {/* Right Column: Message Content */}
          <div className="w-full md:w-2/3 space-y-8 text-lg text-slate-700 dark:text-slate-300">
            <div>
              <h2 className="text-4xl font-bold text-primary mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">{t("title")}</h2>
              <p className="font-semibold text-xl mb-2">{t("greeting")}</p>
              <p className="font-semibold text-xl mb-6">{t("salutation")}</p>
            </div>
            
            <div className="space-y-4">
              <p>{t("intro_p1")}</p>
              <p>{t("intro_p2")}</p>
              <p>{t("intro_p3")}</p>
              <p>{t("intro_p4")}</p>
              <p>{t("intro_p5")}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border-l-4 border-accent shadow-sm my-8">
              <p className="text-xl italic font-medium leading-relaxed">{t("belief_p1")}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">{t("youth_title")}</h3>
              <p>{t("youth_desc")}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">{t("women_title")}</h3>
              <p>{t("women_desc")}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">{t("promise_title")}</h3>
              <p>{t("promise_desc")}</p>
            </div>

            <div className="bg-primary text-white p-8 rounded-3xl my-8">
              <h3 className="text-2xl font-bold text-accent mb-6">{t("we_believe_title")}</h3>
              <ul className="space-y-4 text-xl font-medium">
                {t.raw("we_believe_points").map((point: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="text-accent mt-1">✦</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">{t("appeal_title")}</h3>
              <p>{t("appeal_p1")}</p>
              <p>{t("appeal_p2")}</p>
              <p className="font-medium text-slate-900 dark:text-white">{t("appeal_p3")}</p>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <p className="text-2xl font-bold text-accent">{t("closing_slogan")}</p>
              <div className="pt-4">
                <p className="text-slate-600 dark:text-slate-400">{t("sign_off")}</p>
                <p className="font-bold text-xl text-primary mt-1">{t("founder_name_sign")}</p>
                <p className="text-sm text-slate-500">{t("founder_title")}</p>
                <p className="text-sm text-slate-500">{t("party_name")}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
