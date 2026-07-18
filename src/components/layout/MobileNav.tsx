"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { aboutLinks, policyLinks, orgLinks, mediaLinks, membershipLinks, contactLinks } from "./MegaMenu";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Navigation");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        }
      />
      <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center space-x-2">
              <img src="/logo.jpg" alt="RAVP Logo" className="w-10 h-10 rounded-full" />
              <span className="font-bold text-lg text-primary leading-tight">
                {t("party_name_full")}
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-4">
          <Link href="/" onClick={() => setOpen(false)} className="text-sm font-medium p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
            {t("home")}
          </Link>
          
          <Accordion multiple={false} className="w-full">
            <AccordionItem value="about">
              <AccordionTrigger className="p-2 hover:no-underline hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">{t("about")}</AccordionTrigger>
              <AccordionContent className="pl-4 pb-0 flex flex-col gap-2 pt-2">
                {aboutLinks.map((link) => (
                  <Link key={link.titleKey} href={link.href as any} onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-primary">
                    {t(link.titleKey as any)}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="policies">
              <AccordionTrigger className="p-2 hover:no-underline hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">{t("policies")}</AccordionTrigger>
              <AccordionContent className="pl-4 pb-0 flex flex-col gap-2 pt-2">
                {policyLinks.map((link) => (
                  <Link key={link.titleKey} href={link.href as any} onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-primary">
                    {t(link.titleKey as any)}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="organization">
              <AccordionTrigger className="p-2 hover:no-underline hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">{t("organization")}</AccordionTrigger>
              <AccordionContent className="pl-4 pb-0 flex flex-col gap-2 pt-2">
                {orgLinks.map((link) => (
                  <Link key={link.titleKey} href={link.href as any} onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-primary">
                    {t(link.titleKey as any)}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="membership">
              <AccordionTrigger className="p-2 hover:no-underline hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">{t("membership")}</AccordionTrigger>
              <AccordionContent className="pl-4 pb-0 flex flex-col gap-2 pt-2">
                {membershipLinks.map((link) => (
                  <Link key={link.titleKey} href={link.href as any} onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-primary">
                    {t(link.titleKey as any)}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="media">
              <AccordionTrigger className="p-2 hover:no-underline hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">{t("media")}</AccordionTrigger>
              <AccordionContent className="pl-4 pb-0 flex flex-col gap-2 pt-2">
                {mediaLinks.map((link) => (
                  <Link key={link.titleKey} href={link.href as any} onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-primary">
                    {t(link.titleKey as any)}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="contact">
              <AccordionTrigger className="p-2 hover:no-underline hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">{t("contact")}</AccordionTrigger>
              <AccordionContent className="pl-4 pb-0 flex flex-col gap-2 pt-2">
                {contactLinks.map((link) => (
                  <Link key={link.titleKey} href={link.href as any} onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-primary">
                    {t(link.titleKey as any)}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Link href="/membership/register" onClick={() => setOpen(false)} className="mt-4">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              {t("become_member")}
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
