"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "gu" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button variant="outline" size="sm" onClick={toggleLanguage} className="min-w-[80px]">
      {locale === "en" ? "ગુજરાતી" : "English"}
    </Button>
  );
}
