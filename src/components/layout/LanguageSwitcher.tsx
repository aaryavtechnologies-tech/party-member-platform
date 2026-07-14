"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const changeLanguage = (nextLocale: "en" | "gu") => {
    if (nextLocale === locale) return;
    
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 h-9 px-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors" disabled={isPending}>
        <Globe className="w-4 h-4 text-slate-500" />
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {locale === "en" ? "EN" : "ગુજ"}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 rounded-xl">
        <DropdownMenuItem 
          onClick={() => changeLanguage("en")}
          className={`cursor-pointer rounded-lg ${locale === 'en' ? 'bg-primary/10 text-primary font-bold' : ''}`}
        >
          <span className="mr-2">🇬🇧</span> English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage("gu")}
          className={`cursor-pointer rounded-lg ${locale === 'gu' ? 'bg-primary/10 text-primary font-bold' : ''}`}
        >
          <span className="mr-2">🇮🇳</span> ગુજરાતી
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
