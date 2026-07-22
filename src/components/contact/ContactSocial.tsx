"use client";

import { MessageCircle, Send, ExternalLink, Clock, Share2 } from "lucide-react";

interface SocialItem {
  platform: string;
  platformNameEn: string;
  platformNameGu: string;
  url?: string;
  isEnabled?: boolean;
}

interface ContactSocialProps {
  locale: string;
  socialLinks?: SocialItem[];
}

// Custom inline SVG icons for Facebook, Instagram, X (Twitter), YouTube
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function ContactSocial({ locale, socialLinks }: ContactSocialProps) {
  const isGu = locale === "gu";

  const defaultLinks: SocialItem[] = [
    { platform: "FACEBOOK", platformNameEn: "Facebook", platformNameGu: "ફેસબુક", url: "https://facebook.com/ravp", isEnabled: true },
    { platform: "INSTAGRAM", platformNameEn: "Instagram", platformNameGu: "ઇન્સ્ટાગ્રામ", url: "https://instagram.com/ravp", isEnabled: true },
    { platform: "TWITTER", platformNameEn: "X (Twitter)", platformNameGu: "X (ટ્વિટર)", url: "https://x.com/ravp", isEnabled: true },
    { platform: "YOUTUBE", platformNameEn: "YouTube", platformNameGu: "યુટ્યુબ", url: "https://youtube.com/ravp", isEnabled: true },
    { platform: "WHATSAPP", platformNameEn: "WhatsApp Channel", platformNameGu: "વોટ્સએપ ચેનલ", url: "", isEnabled: true },
    { platform: "TELEGRAM", platformNameEn: "Telegram Channel", platformNameGu: "ટેલિગ્રામ ચેનલ", url: "", isEnabled: true },
  ];

  const linksToDisplay = socialLinks && socialLinks.length > 0 ? socialLinks : defaultLinks;

  const getPlatformIcon = (platform: string) => {
    switch (platform.toUpperCase()) {
      case "FACEBOOK":
        return { icon: FacebookIcon, bg: "from-blue-600 to-blue-800" };
      case "INSTAGRAM":
        return { icon: InstagramIcon, bg: "from-pink-600 via-purple-600 to-amber-500" };
      case "TWITTER":
        return { icon: TwitterXIcon, bg: "from-slate-700 to-slate-900" };
      case "YOUTUBE":
        return { icon: YoutubeIcon, bg: "from-red-600 to-rose-700" };
      case "WHATSAPP":
        return { icon: MessageCircle, bg: "from-green-500 to-emerald-700" };
      case "TELEGRAM":
        return { icon: Send, bg: "from-sky-500 to-blue-600" };
      default:
        return { icon: ExternalLink, bg: "from-slate-600 to-slate-800" };
    }
  };

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950/60 px-4 py-1.5 rounded-full inline-block mb-3">
            {isGu ? "સોશિયલ મીડિયા" : "Digital Channels"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {isGu ? "સોશિયલ મીડિયા પ્લેટફોર્મ્સ" : "Connect With Us Online"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {isGu
              ? "પક્ષના તાજા સમાચાર, રેલીઓ અને નીતિ વિષયક અપડેટ્સ માટે સોશિયલ મીડિયા પર જોડાઓ."
              : "Follow RAVP across our official social channels for real-time announcements & updates."}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {linksToDisplay.map((item, idx) => {
            const { icon: IconComp, bg } = getPlatformIcon(item.platform);
            const name = isGu ? item.platformNameGu : item.platformNameEn;
            const hasUrl = Boolean(item.url && item.url.trim() !== "");

            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-900/5 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${bg} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                    <IconComp className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                      {name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {hasUrl ? (isGu ? "સત્તાવાર પેજ" : "Official Handle") : (isGu ? "ટૂંક સમયમાં શરૂ થશે" : "Launching Soon")}
                    </p>
                  </div>
                </div>

                {hasUrl ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-green-600 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{isGu ? "ટૂંક સમયમાં" : "Coming Soon"}</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
