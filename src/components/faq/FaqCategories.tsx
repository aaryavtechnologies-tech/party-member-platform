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
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {/* All Categories Tab */}
          <button
            onClick={() => onSelectCategory("all")}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
              selectedCategory === "all"
                ? "bg-green-700 text-white shadow-lg shadow-green-700/20"
                : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <Grid className="w-4 h-4" />
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
                className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? "bg-green-700 text-white shadow-lg shadow-green-700/20"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
