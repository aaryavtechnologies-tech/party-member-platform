"use client";

import {
  UserCheck,
  TrendingUp,
  Calendar,
  Building2,
  Map,
  Newspaper,
  Lightbulb,
  AlertCircle,
  HandHeart,
  Network,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";

interface ContactServicesProps {
  locale: string;
}

export function ContactServices({ locale }: ContactServicesProps) {
  const isGu = locale === "gu";

  const services = [
    {
      icon: UserCheck,
      titleEn: "Membership Registration",
      titleGu: "સભ્યપદ નોંધણી",
      descEn: "Register online to become an official primary or active member of RAVP.",
      descGu: "RAVP ના સત્તાવાર પ્રાથમિક અથવા સક્રિય સભ્ય બનવા માટે ઓનલાઇન નોંધણી કરો.",
      link: "/membership",
      color: "from-green-500 to-emerald-700",
    },
    {
      icon: TrendingUp,
      titleEn: "Membership Upgrade",
      titleGu: "સભ્યપદ અપગ્રેડ",
      descEn: "Upgrade your membership tier to Lifetime Primary or Active Status.",
      descGu: "તમારું સભ્યપદ સ્તર આજીવન પ્રાથમિક અથવા સક્રિય સભ્યપદમાં અપગ્રેડ કરો.",
      link: "/membership",
      color: "from-amber-500 to-amber-700",
    },
    {
      icon: Calendar,
      titleEn: "Program Information",
      titleGu: "કાર્યક્રમ માહિતી",
      descEn: "Get updates on upcoming party rallies, farmer conventions, and public events.",
      descGu: "આગામી પક્ષ રેલીઓ, ખેડૂત સંમેલનો અને જાહેર કાર્યક્રમોની માહિતી મેળવો.",
      link: "/news",
      color: "from-blue-500 to-indigo-700",
    },
    {
      icon: Building2,
      titleEn: "District Office Contact",
      titleGu: "જિલ્લા કાર્યાલય સંપર્ક",
      descEn: "Connect directly with district office bearers and party representatives across Gujarat.",
      descGu: "ગુજરાતભરના જિલ્લા હોદ્દેદારો અને પક્ષના પ્રતિનિધિઓ સાથે સીધો સંપર્ક કરો.",
      link: "/district-team",
      color: "from-purple-500 to-purple-800",
    },
    {
      icon: Map,
      titleEn: "Taluka Office Contact",
      titleGu: "તાલુકા કાર્યાલય સંપર્ક",
      descEn: "Reach out to local taluka committee leaders for grassroots support.",
      descGu: "સ્થાનિક ગ્રાસરૂટ મદદ માટે તાલુકા સમિતિના આગેવાનોનો સંપર્ક કરો.",
      link: "/taluka-team",
      color: "from-teal-500 to-teal-700",
    },
    {
      icon: Newspaper,
      titleEn: "Media & Press",
      titleGu: "મીડિયા અને પ્રેસ",
      descEn: "Official press releases, media inquiries, and spokesperson contact info.",
      descGu: "સત્તાવાર અખબારી યાદી, મીડિયા પૂછપરછ અને પ્રવક્તા સંપર્ક માહિતી.",
      link: "/news",
      color: "from-rose-500 to-red-700",
    },
    {
      icon: Lightbulb,
      titleEn: "Suggestions",
      titleGu: "સૂચનો",
      descEn: "Share your ideas and valuable suggestions to help shape party policies.",
      descGu: "પક્ષની નીતિ ઘડવામાં મદદરૂપ નીવડે તેવા તમારા વિચારો અને સૂચનો મોકલો.",
      link: "#contact-form-section",
      color: "from-yellow-500 to-amber-600",
    },
    {
      icon: AlertCircle,
      titleEn: "Complaints & Grievances",
      titleGu: "ફરિયાદ અને રજૂઆત",
      descEn: "Submit your public grievances for prompt review by party officials.",
      descGu: "પક્ષના અધિકારીઓ દ્વારા ઝડપી સમીક્ષા માટે તમારા લોકપ્રશ્નો અને ફરિયાદો દાખલ કરો.",
      link: "#contact-form-section",
      color: "from-orange-500 to-red-600",
    },
    {
      icon: HandHeart,
      titleEn: "Volunteer Registration",
      titleGu: "સ્વયંસેવક નોંધણી",
      descEn: "Join our dedicated volunteer force for social service and campaign drives.",
      descGu: "સામાજિક સેવા અને પક્ષીય ઝુંબેશ માટે અમારા સમર્પિત સ્વયંસેવક દળમાં જોડાઓ.",
      link: "#contact-form-section",
      color: "from-emerald-500 to-green-700",
    },
    {
      icon: Network,
      titleEn: "Organization Information",
      titleGu: "સંગઠન માહિતી",
      descEn: "Learn about party structure, national & state bodies, and leadership.",
      descGu: "પક્ષનું માળખું, રાષ્ટ્રીય અને રાજ્ય કારોબારી તથા નેતૃત્વ વિશે જાણો.",
      link: "/organization",
      color: "from-cyan-500 to-blue-700",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950/60 px-4 py-1.5 rounded-full inline-block mb-3">
            {isGu ? "અમારી સેવાઓ" : "Public Assistance"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {isGu ? "સંપર્ક સેવાઓ" : "Contact Services & Help Desks"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base mt-3">
            {isGu
              ? "આપની સુવિધા માટે પક્ષના વિવિધ વિભાગો અને મદદ કેન્દ્રો નીચે મુજબ છે."
              : "Explore our dedicated communication channels and public support desks."}
          </p>
        </div>

        {/* 10 Animated Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => {
            const IconComponent = service.icon;
            const title = isGu ? service.titleGu : service.titleEn;
            const desc = isGu ? service.descGu : service.descEn;

            return (
              <Link
                key={idx}
                href={service.link}
                className="group relative bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-900/5 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Colored Accent Line */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-green-600 dark:group-hover:text-green-400 flex items-center gap-1 transition-colors">
                      <span>{isGu ? "એક્સેસ કરો" : "Access"}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>

                  <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                    {title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
