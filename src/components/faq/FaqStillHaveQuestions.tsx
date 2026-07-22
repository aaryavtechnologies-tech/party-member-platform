"use client";

import { Link } from "@/i18n/routing";
import { MessageSquare, PhoneCall, UserPlus } from "lucide-react";

interface FaqStillHaveQuestionsProps {
  locale: string;
}

export function FaqStillHaveQuestions({ locale }: FaqStillHaveQuestionsProps) {
  const isGu = locale === "gu";

  return (
    <section className="py-20 bg-gradient-to-br from-green-900 via-green-950 to-slate-950 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center space-y-8">
        <div className="w-16 h-16 rounded-3xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/30">
          <MessageSquare className="w-8 h-8" />
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-amber-300 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 inline-block">
            {isGu ? "૨૪x૭ હેલ્પલાઇન" : "Direct Assistance"}
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            {isGu ? "તમારો પ્રશ્ન અહીં નથી?" : "Didn't find your answer?"}
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
            {isGu
              ? "કૃપા કરીને અમારી સત્તાવાર સપોર્ટ ટીમ અને કાર્યાલય હેલ્પલાઇનનો સંપર્ક કરો. અમે આપના પ્રશ્નનું નિવારણ લાવવા માટે તત્પર છીએ."
              : "Please contact our dedicated support team and central office helpline. We are always ready to assist you."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-5 h-5" />
            <span>{isGu ? "અમારો સંપર્ક કરો" : "Contact Us"}</span>
          </Link>

          <Link
            href="/membership"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5 text-green-400" />
            <span>{isGu ? "સભ્ય બનો" : "Become Member"}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
