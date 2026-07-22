"use client";

import { Link } from "@/i18n/routing";
import { ChevronRight, HelpCircle, UserPlus, PhoneCall, Sparkles } from "lucide-react";

interface FaqHeroProps {
  locale: string;
}

export function FaqHero({ locale }: FaqHeroProps) {
  const isGu = locale === "gu";

  const title = isGu ? "વારંવાર પૂછાતા પ્રશ્નો (FAQ)" : "Frequently Asked Questions";
  const subtitle = isGu ? "આપના પ્રશ્નો – અમારા જવાબ" : "Your Questions – Our Answers";
  const homeLabel = isGu ? "મુખ્ય પૃષ્ઠ" : "Home";
  const contactBtnText = isGu ? "અમારો સંપર્ક કરો" : "Contact Us";
  const memberBtnText = isGu ? "સભ્ય બનો" : "Become a Member";

  return (
    <section className="relative min-h-[460px] sm:min-h-[520px] flex items-center justify-center overflow-hidden bg-slate-950 text-white py-16">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center space-y-6">
        {/* Animated FAQ Illustration Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-green-950/80 border border-green-700/50 backdrop-blur-md shadow-lg animate-bounce-subtle">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-green-500 text-slate-950 flex items-center justify-center font-black">
            <HelpCircle className="w-5 h-5 text-slate-950" />
          </div>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-green-300">
            {isGu ? "૨૪x૭ સહાયતા કેન્દ્ર" : "24x7 Support & Information"}
          </span>
        </div>

        {/* Breadcrumb Navigation */}
        <nav className="flex justify-center items-center gap-2 text-xs sm:text-sm text-slate-400 font-medium">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            {homeLabel}
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-amber-400 font-semibold">FAQ</span>
        </nav>

        {/* Large Animated Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-green-300 to-emerald-400">
            {title}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-2xl text-slate-200 font-extrabold max-w-2xl mx-auto tracking-wide">
          "{subtitle}"
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-5 h-5" />
            <span>{contactBtnText}</span>
          </Link>

          <Link
            href="/membership"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm sm:text-base backdrop-blur-md hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5 text-green-400" />
            <span>{memberBtnText}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
