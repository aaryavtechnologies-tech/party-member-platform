"use client";

import { Shield, Sparkles, Users, Award } from "lucide-react";

interface ContactIntroProps {
  locale: string;
  data?: {
    headingEn?: string;
    headingGu?: string;
    contentEn?: string;
    contentGu?: string;
  };
}

export function ContactIntro({ locale, data }: ContactIntroProps) {
  const isGu = locale === "gu";

  const heading = isGu
    ? data?.headingGu || "ગુજરાત અને ભારતના ખેડૂતો અને નાગરિકોની સેવા માટે સમર્પિત"
    : data?.headingEn || "Dedicated to Serving Farmers & Citizens Across Gujarat and India";

  const content = isGu
    ? data?.contentGu || "રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી (RAVP) પારદર્શી શાસન, સીધા સંવાદ અને જનકલ્યાણ માટે અવિરત સમર્પણમાં માને છે. સભ્યપદ, સ્થાનિક સમસ્યાઓ કે પક્ષની પહેલો અંગે તમારી પાસે કોઈ પ્રશ્ન હોય, તો અમારી ટીમ હંમેશા આપની મદદ માટે તૈયાર છે."
    : data?.contentEn || "Rashtriya Annadata Vikas Party (RAVP) believes in open governance, direct communication, and unyielding dedication to public welfare. Whether you have questions regarding membership, local district issues, or party initiatives, our team is always ready to support you.";

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-1 bg-amber-500 rounded-full" />
          <div className="p-2 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400">
            <Shield className="w-5 h-5" />
          </div>
          <div className="w-8 h-1 bg-amber-500 rounded-full" />
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Column 1: Heading & Badge */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGu ? "જનસેવાયજ્ઞ" : "Public Service First"}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {heading}
            </h2>

            {/* Decorative Divider */}
            <div className="w-24 h-1.5 bg-gradient-to-r from-green-600 via-emerald-500 to-amber-500 rounded-full" />
          </div>

          {/* Column 2: Content & Cards */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {content}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-green-600 text-white shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {isGu ? "૨૪x૭ જનસંપર્ક" : "24x7 Public Accessibility"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isGu ? "તાલુકા અને જિલ્લા સ્તરે પ્રતિસાદ" : "Prompt responses across all levels"}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {isGu ? "ખેડૂત પ્રથમ નીતિ" : "Farmer First Policy"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isGu ? "ખેડૂતો અને શ્રમિકો માટે અવાજ" : "Unwavering commitment to farmers"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
