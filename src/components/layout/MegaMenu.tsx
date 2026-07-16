"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useTranslations } from "next-intl";

const aboutLinks = [
  { titleKey: "about", href: "/about" },
  { titleKey: "our_journey", href: "/about/journey" },
  { titleKey: "founder_message", href: "/about/founder-message" },
  { titleKey: "resolutions_25", href: "/about/25-resolutions" },
  { titleKey: "vision_2047", href: "/about/vision-2047" },
  { titleKey: "mission", href: "/about/mission" },
  { titleKey: "core_values", href: "/about/core-values" },
  { titleKey: "objectives", href: "/about/objectives" },
];

const policyLinks = [
  { titleKey: "farmer", href: "/policies/farmer" },
  { titleKey: "youth", href: "/policies/youth" },
  { titleKey: "women", href: "/policies/women" },
  { titleKey: "msme", href: "/policies/business-msme" },
  { titleKey: "education", href: "/policies/education" },
  { titleKey: "health", href: "/policies/health" },
  { titleKey: "rural_development", href: "/policies/rural-development" },
  { titleKey: "environment", href: "/policies/environment" },
];

const orgLinks = [
  { titleKey: "structure", href: "/organization/structure" },
  { titleKey: "national_team", href: "/organization/national" },
  { titleKey: "state_team", href: "/organization/state" },
  { titleKey: "district_team", href: "/organization/district" },
  { titleKey: "taluka_team", href: "/organization/taluka" },
  { titleKey: "village_team", href: "/organization/village" },
];

const mediaLinks = [
  { titleKey: "news", href: "/media/news" },
  { titleKey: "press_releases", href: "/media/press-release" },
  { titleKey: "photo_gallery", href: "/media/photo-gallery" },
  { titleKey: "video_gallery", href: "/media/video-gallery" },
];

export function MegaMenu() {
  const t = useTranslations("Navigation");

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {t("home")}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>{t("about")}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-slate-950">
              {aboutLinks.map((link) => (
                <ListItem key={link.titleKey} title={t(link.titleKey as any)} href={link.href} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>{t("policies")}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-slate-950">
              {policyLinks.map((link) => (
                <ListItem key={link.titleKey} title={t(link.titleKey as any)} href={link.href} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>{t("organization")}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-slate-950">
              {orgLinks.map((link) => (
                <ListItem key={link.titleKey} title={t(link.titleKey as any)} href={link.href} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>{t("media")}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2 bg-white dark:bg-slate-950">
              {mediaLinks.map((link) => (
                <ListItem key={link.titleKey} title={t(link.titleKey as any)} href={link.href} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/membership" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {t("membership")}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {t("contact")}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { href: string; title: string }
>(({ className, title, href, ...props }, ref) => {
  return (
    <li>
      <Link href={href as any} legacyBehavior passHref>
        <NavigationMenuLink
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-primary focus:bg-slate-100 focus:text-primary dark:hover:bg-slate-800 dark:focus:bg-slate-800",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
        </NavigationMenuLink>
      </Link>
    </li>
  );
});
ListItem.displayName = "ListItem";
