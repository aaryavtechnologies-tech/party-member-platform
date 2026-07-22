"use client";

import { Link } from "@/i18n/routing";
import { UserPlus, HeartHandshake, Info, CheckCircle2 } from "lucide-react";

interface ContactJoinCtaProps {
  locale: string;
}

export function ContactJoinCta({ locale }: ContactJoinCtaProps) {
  const isGu = locale === "gu";

  const benefits = isGu
    ? [
        "ખેડૂતો અને શ્રમિકોના હિતમાં સક્રિય યોગદાન",
        "પક્ષની રાજ્ય અને રાષ્ટ્રીય પ્રવૃત્તિઓમાં ભાગીદારી",
        "પ્રાથમિક તથા આજીવન સભ્યપદના વિશેષ અધિકારો",
        "તમારા તાલુકા અને જિલ્લામાં લોકપ્રશ્નો ઉઠાવવાની તક",
      ]
    : [
        "Active contribution to farmer and worker rights",
        "Direct participation in state and national party events",
        "Exclusive access to Primary and Lifetime Membership tiers",
        "Platform to address grassroots grievances in your taluka and district",
      ];

  return (
    <section className="py-16 bg-gradient-to-br from-green-900 via-green-950 to-slate-950 text-white relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="bg-slate-900/80 border border-green-800/50 rounded-3xl p-8 sm:p-12 backdrop-blur-md shadow-2xl">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase tracking-widest mb-4">
              {isGu ? "પક્ષ સાથે જોડાઓ" : "Join Rashtriya Annadata Vikas Party"}
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              {isGu
                ? "જનસેવા અને દેશવિકાસમાં આપનું યોગદાન આપો"
                : "Become a Champion of Farmer Welfare & National Growth"}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {isGu
                ? "RAVP દરેક નાગરિક અને યુવાને રાષ્ટ્ર નિર્માણની આ યાત્રામાં જોડાવા આહ્વાન કરે છે. આપની સક્રિય ભાગીદારીથી આપણે એક સમૃદ્ધ, આત્મનિર્ભર ભારતનું નિર્માણ કરી શકીશું."
                : "RAVP invites every farmer, youth, woman, and citizen to join hands in transforming rural economy and upholding public trust across India."}
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10 max-w-3xl mx-auto">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-green-950/40 border border-green-800/40 rounded-xl p-3.5">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-sm font-medium text-slate-200">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/membership"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isGu ? "સભ્ય બનો" : "Become a Member"}</span>
            </Link>

            <a
              href="#contact-form-section"
              className="px-6 py-3 rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-sm sm:text-base transition-all flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>{isGu ? "સ્વયંસેવક નોંધણી" : "Volunteer Now"}</span>
            </a>

            <Link
              href="/about"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm sm:text-base transition-all flex items-center gap-2"
            >
              <Info className="w-4 h-4 text-amber-400" />
              <span>{isGu ? "વધુ જાણો" : "Learn More"}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
