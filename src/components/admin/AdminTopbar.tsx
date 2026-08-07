"use client";

import { Button } from "@/components/ui/button";
import { Search, Bell, Menu, User as UserIcon, Lock, Settings } from "lucide-react";
import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { BroadcastBell } from "@/components/admin/BroadcastBell";
import { AdminRole } from "@prisma/client";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminTopbar({ 
  setMobileOpen,
  adminRole = null
}: { 
  setMobileOpen: (v: boolean) => void;
  adminRole?: AdminRole | null;
}) {
  const t = useTranslations("admin.topbar");
  const displayRole = adminRole ? adminRole.replace("_ADMIN", " Admin").toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : t("superadmin");

  return (
    <header className="h-16 shrink-0 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div className="hidden sm:flex items-center max-w-md w-full relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder={t("searchPlaceholder")} 
            className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        
        <LanguageSwitcher />

        {/* Notifications */}
        <BroadcastBell />

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2" />

        {/* Admin Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center gap-3 cursor-pointer group p-1 pr-3 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                A
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{t("adminUser")}</p>
                <p className="text-xs text-slate-500">{displayRole}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl">
            <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/admin/profile" className="flex items-center gap-2 w-full">
                <UserIcon className="w-4 h-4 text-slate-500" />
                <span>{t("updateProfile")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/admin/settings/password" className="flex items-center gap-2 w-full">
                <Lock className="w-4 h-4 text-slate-500" />
                <span>{t("updatePassword")}</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}
