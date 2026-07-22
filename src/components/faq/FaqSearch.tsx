"use client";

import { Search, X, Sparkles } from "lucide-react";

interface FaqSearchProps {
  locale: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function FaqSearch({ locale, searchTerm, onSearchChange }: FaqSearchProps) {
  const isGu = locale === "gu";

  const quickKeywords = [
    { en: "Membership", gu: "સભ્યપદ" },
    { en: "Member ID", gu: "આઈડી કાર્ડ" },
    { en: "Payment", gu: "પેમેન્ટ" },
    { en: "Contact", gu: "સંપર્ક" },
    { en: "Login", gu: "લૉગ ઇન" },
    { en: "Password", gu: "પાસવર્ડ" },
  ];

  return (
    <section className="py-8 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-4xl space-y-4">
        {/* Search Bar Input */}
        <div className="relative shadow-xl rounded-2xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-green-500 transition-all">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              isGu
                ? "તમારો પ્રશ્ન અથવા કીવર્ડ અહીં શોધો (દા.ત. સભ્યપદ, પેમેન્ટ, લૉગિન)..."
                : "Search questions or keywords (e.g. Membership, Payment, ID Card)..."
            }
            className="w-full pl-12 pr-12 py-3.5 bg-transparent text-slate-900 dark:text-white text-base sm:text-lg focus:outline-none placeholder-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="p-2 absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Popular Quick Keyword Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs sm:text-sm">
          <span className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isGu ? "મુખ્ય શોધો:" : "Popular Searches:"}</span>
          </span>

          {quickKeywords.map((kw, idx) => {
            const word = isGu ? kw.gu : kw.en;
            const isSelected = searchTerm.toLowerCase() === word.toLowerCase();

            return (
              <button
                key={idx}
                onClick={() => onSearchChange(isSelected ? "" : word)}
                className={`px-3 py-1 rounded-full border transition-all font-semibold ${
                  isSelected
                    ? "bg-green-700 text-white border-green-700 shadow-md"
                    : "bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-green-500"
                }`}
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
