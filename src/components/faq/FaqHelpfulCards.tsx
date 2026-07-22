"use client";

import { Link } from "@/i18n/routing";
import { UserCheck, TrendingUp, PhoneCall, Network, ArrowRight } from "lucide-react";

interface FaqHelpfulCardsProps {
  locale: string;
}

export function FaqHelpfulCards({ locale }: FaqHelpfulCardsProps) {
  const isGu = locale === "gu";

  const cards = [
    {
      icon: UserCheck,
      titleEn: "Member Registration",
      titleGu: "સભ્ય નોંધણી",
      descEn: "Register online in minutes to become a registered primary or active member of RAVP.",
      descGu: "RAVP ના પ્રાથમિક અથવા સક્રિય સભ્ય બનવા માટે મિનિટોમાં ઓનલાઇન નોંધણી કરો.",
      btnTextEn: "Register Now",
      btnTextGu: "હવે નોંધણી કરો",
      link: "/membership",
      color: "from-green-600 to-emerald-700",
    },
    {
      icon: TrendingUp,
      titleEn: "Membership Upgrade",
      titleGu: "સભ્યપદ અપગ્રેડ",
      descEn: "Upgrade your tier to Lifetime Primary or Active status to participate in party post elections.",
      descGu: "પક્ષના હોદ્દાની ચૂંટણીમાં ભાગ લેવા માટે તમારી સભ્યપદ આજીવન કે સક્રિય સ્તરમાં અપગ્રેડ કરો.",
      btnTextEn: "Upgrade Membership",
      btnTextGu: "સભ્યપદ અપગ્રેડ કરો",
      link: "/membership",
      color: "from-amber-500 to-amber-700",
    },
    {
      icon: PhoneCall,
      titleEn: "Contact Support",
      titleGu: "સંપર્ક અને મદદ",
      descEn: "Reach out to our Rajkot Central Office helpline or send direct online inquiries.",
      descGu: "અમારા રાજકોટ મુખ્ય કાર્યાલય હેલ્પલાઇનનો સંપર્ક કરો અથવા ઑનલાઇન સંદેશ મોકલો.",
      btnTextEn: "Contact Us",
      btnTextGu: "અમારો સંપર્ક કરો",
      link: "/contact",
      color: "from-blue-600 to-indigo-800",
    },
    {
      icon: Network,
      titleEn: "Organization Structure",
      titleGu: "સંગઠન માળખું",
      descEn: "Explore party leadership and committee members at National, State, District, and Taluka levels.",
      descGu: "રાષ્ટ્રીય, પ્રદેશ, જિલ્લા અને તાલુકા સ્તરે પક્ષના હોદ્દેદારો અને કારોબારી વિશે જાણો.",
      btnTextEn: "View Structure",
      btnTextGu: "સંગઠન જુઓ",
      link: "/organization",
      color: "from-purple-600 to-purple-800",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950/60 px-4 py-1.5 rounded-full inline-block mb-3">
            {isGu ? "ઝડપી માહિતી" : "Helpful Portals"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {isGu ? "ઉપયોગી સેવાઓ અને પોર્ટલ" : "Helpful Information Portals"}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const IconComp = card.icon;
            const title = isGu ? card.titleGu : card.titleEn;
            const desc = isGu ? card.descGu : card.descEn;
            const btnText = isGu ? card.btnTextGu : card.btnTextEn;

            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-950 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-900/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center mb-5 shadow-lg`}>
                    <IconComp className="w-6 h-6" />
                  </div>

                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mb-2">
                    {title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {desc}
                  </p>
                </div>

                <Link
                  href={card.link}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-green-700 text-white font-bold text-xs sm:text-sm text-center transition-colors flex items-center justify-center gap-2 group"
                >
                  <span>{btnText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
