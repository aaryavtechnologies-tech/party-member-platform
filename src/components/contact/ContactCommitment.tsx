"use client";

import { Award, ShieldCheck, HeartHandshake } from "lucide-react";

interface ContactCommitmentProps {
  locale: string;
  data?: {
    titleEn?: string;
    titleGu?: string;
    contentEn?: string;
    contentGu?: string;
  };
}

export function ContactCommitment({ locale, data }: ContactCommitmentProps) {
  const isGu = locale === "gu";

  const title = isGu
    ? data?.titleGu || "જનસેવા માટે અમારું વચન"
    : data?.titleEn || "Our Commitment to Public Service";

  const content = isGu
    ? data?.contentGu || "દરેક અવાજ મહત્વપૂર્ણ છે. દરેક સમસ્યા સાંભળવામાં આવશે. RAVP સમૃદ્ધ ભારત માટે પારદર્શિતા, ઝડપી પ્રતિસાદ અને દરેક લોકપ્રશ્નનું નિવારણ લાવવાનું વચન આપે છે."
    : data?.contentEn || "Every voice matters. Every concern will be heard. RAVP promises transparency, prompt response, and steadfast commitment to solving every public grievance for a prosperous India.";

  return (
    <section className="py-16 bg-gradient-to-r from-green-950 via-slate-950 to-green-950 text-white border-b border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-green-500 text-slate-950 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/20">
          <Award className="w-8 h-8" />
        </div>

        <span className="inline-block px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold uppercase tracking-widest border border-amber-500/30">
          {isGu ? "અમારો સંકલ્પ" : "Our Core Promise"}
        </span>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white max-w-3xl mx-auto leading-tight">
          {title}
        </h2>

        <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-medium">
          {content}
        </p>

        <div className="pt-6 flex flex-wrap justify-center gap-8 text-xs font-bold text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>{isGu ? "૧૦૦% પારદર્શિતા" : "100% Transparency"}</span>
          </div>

          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>{isGu ? "ઝડપી સમસ્યા નિવારણ" : "Prompt Grievance Redressal"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
