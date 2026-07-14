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
  { titleKey: "About Us", href: "/about" },
  { titleKey: "Our Journey", href: "/about/journey" },
  { titleKey: "Founder Message", href: "/about/founder-message" },
  { titleKey: "25 Resolutions", href: "/about/25-resolutions" },
  { titleKey: "Vision 2047", href: "/about/vision-2047" },
  { titleKey: "Mission", href: "/about/mission" },
  { titleKey: "Core Values", href: "/about/core-values" },
  { titleKey: "Objectives", href: "/about/objectives" },
];

const policyLinks = [
  { titleKey: "Farmer", href: "/policies/farmer" },
  { titleKey: "Youth", href: "/policies/youth" },
  { titleKey: "Women", href: "/policies/women" },
  { titleKey: "MSME", href: "/policies/business-msme" },
  { titleKey: "Education", href: "/policies/education" },
  { titleKey: "Health", href: "/policies/health" },
  { titleKey: "Rural Development", href: "/policies/rural-development" },
  { titleKey: "Environment", href: "/policies/environment" },
];

const orgLinks = [
  { titleKey: "Structure", href: "/organization/structure" },
  { titleKey: "National Team", href: "/organization/national" },
  { titleKey: "State Team", href: "/organization/state" },
  { titleKey: "District Team", href: "/organization/district" },
  { titleKey: "Taluka Team", href: "/organization/taluka" },
  { titleKey: "Village Team", href: "/organization/village" },
];

const mediaLinks = [
  { titleKey: "News", href: "/media/news" },
  { titleKey: "Press Releases", href: "/media/press-release" },
  { titleKey: "Photo Gallery", href: "/media/photo-gallery" },
  { titleKey: "Video Gallery", href: "/media/video-gallery" },
];

export function MegaMenu() {
  const t = useTranslations("Navigation");

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {t("Home")}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>{t("About Us")}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-slate-950">
              {aboutLinks.map((link) => (
                <ListItem key={link.titleKey} title={t(link.titleKey as any)} href={link.href} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>{t("Policies")}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-slate-950">
              {policyLinks.map((link) => (
                <ListItem key={link.titleKey} title={t(link.titleKey as any)} href={link.href} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>{t("Organization")}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-slate-950">
              {orgLinks.map((link) => (
                <ListItem key={link.titleKey} title={t(link.titleKey as any)} href={link.href} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>{t("Media")}</NavigationMenuTrigger>
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
              {t("Membership")}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {t("Contact")}
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
