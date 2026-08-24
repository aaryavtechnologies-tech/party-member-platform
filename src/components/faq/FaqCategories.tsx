"use client";

import {
  Grid,
  HelpCircle,
  UserPlus,
  CreditCard,
  LayoutDashboard,
  Network,
  PhoneCall,
  ShieldCheck,
  Wrench,
} from "lucide-react";

interface CategoryItem {
  id: string;
  nameEn: string;
  nameGu: string;
  slug: string;
  icon?: string | null;
}

interface FaqCategoriesProps {
  locale: string;
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export function FaqCategories({
  locale,
  categories,
  selectedCategory,
  onSelectCategory,
}: FaqCategoriesProps) {
  const isGu = locale === "gu";

  const getCategoryIcon = (slug: string) => {
    switch (slug.toLowerCase()) {
      case "general":
        return HelpCircle;
      case "membership":
        return UserPlus;
      case "payments":
        return CreditCard;
      case "dashboard":
        return LayoutDashboard;
      case "organization":
        return Network;
      case "contact":
        return PhoneCall;
      case "security":
        return ShieldCheck;
      case "technical":
        return Wrench;
      default:
        return Grid;
    }
  };

  return (
    <div className="sticky top-16 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md py-4 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-2 px-1 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* All Categories Tab */}
          <button
            onClick={() => onSelectCategory("all")}
            className={`px-5 py-3 rounded-2xl font-extrabold text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2.5 shrink-0 snap-start ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg shadow-green-700/25 scale-[1.02]"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow hover:-translate-y-0.5"
            }`}
          >
            <Grid className={`w-4 h-4 ${selectedCategory === "all" ? "text-green-100" : "text-slate-400 dark:text-slate-500"}`} />
            <span>{isGu ? "તમામ શ્રેણીઓ" : "All Categories"}</span>
          </button>

          {/* Dynamic Categories Tabs */}
          {categories.map((cat) => {
            const IconComp = getCategoryIcon(cat.slug);
            const name = isGu ? cat.nameGu : cat.nameEn;
            const isSelected = selectedCategory === cat.slug;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`px-5 py-3 rounded-2xl font-extrabold text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2.5 shrink-0 snap-start ${
                  isSelected
                    ? "bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg shadow-green-700/25 scale-[1.02]"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow hover:-translate-y-0.5"
                }`}
              >
                <IconComp className={`w-4 h-4 ${isSelected ? "text-green-100" : "text-slate-400 dark:text-slate-500"}`} />
                <span>{name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
