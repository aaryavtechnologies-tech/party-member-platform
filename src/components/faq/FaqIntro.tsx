"use client";

import { Sparkles, Info } from "lucide-react";
import { Link } from "@/i18n/routing";

interface FaqIntroProps {
  locale: string;
}

export function FaqIntro({ locale }: FaqIntroProps) {
  const isGu = locale === "gu";

  return (
    <section className="py-12 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 relative overflow-hidden">
          {/* Top Decorative Border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-600 via-amber-500 to-green-600" />

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-green-600 text-white shrink-0 shadow-md">
              <Info className="w-6 h-6" />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGu ? "માર્ગદર્શન કેન્દ્ર" : "Help & Guidance"}</span>
              </div>

              <p className="text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed font-medium">
                {isGu ? (
                  <>
                    આ વિભાગમાં રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી (RAVP) વિશે લોકો દ્વારા વારંવાર પૂછાતા પ્રશ્નોના સરળ અને સ્પષ્ટ જવાબ આપવામાં આવ્યા છે. જો આપને અહીં આપેલા પ્રશ્નો સિવાય અન્ય કોઈ માહિતી જોઈએ, તો કૃપા કરીને{" "}
                    <Link href="/contact" className="text-green-600 dark:text-green-400 font-extrabold underline hover:text-amber-500 transition-colors">
                      "અમારો સંપર્ક કરો (Contact Us)"
                    </Link>{" "}
                    પેજ દ્વારા અમારો સંપર્ક કરી શકો છો.
                  </>
                ) : (
                  <>
                    This section provides clear and direct answers to the most frequently asked questions about the Rashtriya Annadata Vikas Party (RAVP). If you need further details beyond these FAQs, please visit our{" "}
                    <Link href="/contact" className="text-green-600 dark:text-green-400 font-extrabold underline hover:text-amber-500 transition-colors">
                      "Contact Us"
                    </Link>{" "}
                    page to reach our helpline team.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
