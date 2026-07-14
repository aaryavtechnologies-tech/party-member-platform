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

const aboutLinks = [
  { title: "About Us", href: "/about" },
  { title: "Our Journey", href: "/about/journey" },
  { title: "Founder Message", href: "/about/founder-message" },
  { title: "25 Resolutions", href: "/about/25-resolutions" },
  { title: "Vision 2047", href: "/about/vision-2047" },
  { title: "Mission", href: "/about/mission" },
  { title: "Core Values", href: "/about/core-values" },
  { title: "Objectives", href: "/about/objectives" },
];

const policyLinks = [
  { title: "Farmer", href: "/policies/farmer" },
  { title: "Youth", href: "/policies/youth" },
  { title: "Women", href: "/policies/women" },
  { title: "MSME", href: "/policies/business-msme" },
  { title: "Education", href: "/policies/education" },
  { title: "Health", href: "/policies/health" },
  { title: "Rural Development", href: "/policies/rural-development" },
  { title: "Environment", href: "/policies/environment" },
];

const orgLinks = [
  { title: "Structure", href: "/organization/structure" },
  { title: "National Team", href: "/organization/national" },
  { title: "State Team", href: "/organization/state" },
  { title: "District Team", href: "/organization/district" },
  { title: "Taluka Team", href: "/organization/taluka" },
  { title: "Village Team", href: "/organization/village" },
];

const mediaLinks = [
  { title: "News", href: "/media/news" },
  { title: "Press Releases", href: "/media/press-release" },
  { title: "Photo Gallery", href: "/media/photo-gallery" },
  { title: "Video Gallery", href: "/media/video-gallery" },
];

export function MegaMenu() {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>About Us</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-slate-950">
              {aboutLinks.map((link) => (
                <ListItem key={link.title} title={link.title} href={link.href} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Policies</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-slate-950">
              {policyLinks.map((link) => (
                <ListItem key={link.title} title={link.title} href={link.href} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Organization</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-slate-950">
              {orgLinks.map((link) => (
                <ListItem key={link.title} title={link.title} href={link.href} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Media</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2 bg-white dark:bg-slate-950">
              {mediaLinks.map((link) => (
                <ListItem key={link.title} title={link.title} href={link.href} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/membership" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Membership
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Contact
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
