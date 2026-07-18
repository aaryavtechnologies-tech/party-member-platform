"use client";

import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";

export function Header() {
  const t = useTranslations("Navigation");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        {/* Left: Logo + Desktop MegaMenu */}
        <div className="flex gap-6 md:gap-10 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.jpg" alt="RAVP Logo" className="w-12 h-12 rounded-full" />
            <span className="hidden lg:inline-block font-bold text-lg text-primary leading-tight">
              {t("party_name_full")}<br/><span className="text-sm text-muted-foreground">RAVP</span>
            </span>
          </Link>
          <MegaMenu />
        </div>

        {/* Right: Language switcher + Hamburger (mobile) + CTA */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <LanguageSwitcher />
          <MobileNav />
          <Link href="/membership/register" className="hidden md:block">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-6">
              {t("become_member")}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
