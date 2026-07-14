"use client";

import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { MegaMenu } from "./MegaMenu";

export function Header() {
  const t = useTranslations("Index");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-2xl text-primary">
              LOGO
            </span>
          </Link>
          <MegaMenu />
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <Button className="hidden md:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-6">
            Become Member
          </Button>
        </div>
      </div>
    </header>
  );
}
