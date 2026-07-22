"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ChevronRight, ShieldCheck, Mail, UserPlus, MapPin } from "lucide-react";

interface ContactHeroProps {
  locale: string;
  data?: {
    titleEn?: string;
    titleGu?: string;
    subtitleEn?: string;
    subtitleGu?: string;
    heroImage?: string;
  };
}

export function ContactHero({ locale, data }: ContactHeroProps) {
  const isGu = locale === "gu";
  const title = isGu
    ? data?.titleGu || "અમારો સંપર્ક કરો"
    : data?.titleEn || "Contact Us";

  const subtitle = isGu
    ? data?.subtitleGu || "આપનો સંપર્ક, અમારો વિશ્વાસ – જનસેવા માટે હંમેશા આપની સાથે"
    : data?.subtitleEn || "Your Contact, Our Trust – Always With You For Public Service";

  const homeLabel = isGu ? "મુખ્ય પૃષ્ઠ" : "Home";
  const contactLabel = isGu ? "અમારો સંપર્ક કરો" : "Contact Us";
  const memberBtnText = isGu ? "સભ્ય બનો" : "Become a Member";
  const hqBtnText = isGu ? "મુખ્ય કાર્યાલય સંપર્ક" : "Contact Headquarters";

  return (
    <section className="relative min-h-[520px] lg:min-h-[580px] flex items-center justify-center overflow-hidden bg-slate-950 text-white py-20">
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={data?.heroImage || "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=2000&q=80"}
          alt="RAVP Public Service Banner"
          fill
          className="object-cover object-center opacity-35 filter contrast-125"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
        {/* Logo & Emblem */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-green-950/80 border border-green-700/50 backdrop-blur-md mb-6 animate-fade-in shadow-lg">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-green-500 flex items-center justify-center font-black text-slate-950 text-xs shadow">
            RV
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-wide uppercase text-green-300">
            {isGu ? "રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી" : "Rashtriya Annadata Vikas Party"}
          </span>
        </div>

        {/* Breadcrumb Navigation */}
        <nav className="flex justify-center items-center gap-2 text-xs sm:text-sm text-slate-300 mb-6 font-medium">
          <Link href="/" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            {homeLabel}
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-500" />
          <span className="text-amber-400 font-semibold">{contactLabel}</span>
        </nav>

        {/* Animated Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-green-300 to-emerald-400">
            {title}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-200 max-w-3xl mx-auto mb-10 leading-relaxed font-medium text-shadow">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/membership"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>{memberBtnText}</span>
          </Link>

          <a
            href="#headquarters-section"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-base backdrop-blur-md hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5 text-green-400" />
            <span>{hqBtnText}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
