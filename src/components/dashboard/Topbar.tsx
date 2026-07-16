"use client";

import { Bell, Menu, Search, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function Topbar({ setIsOpen }: { setIsOpen: (val: boolean) => void }) {
  const t = useTranslations("dashboard.topbar");
  return (
    <header className="h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4 flex-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </Button>
        
        <div className="relative hidden md:block max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder={t("search")} 
            className="w-full h-11 pl-10 pr-4 bg-slate-100 dark:bg-slate-900 border-none rounded-full focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-900">
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950" />
        </Button>
        
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-primary/20 flex items-center justify-center overflow-hidden cursor-pointer">
          <UserIcon className="w-5 h-5 text-slate-500" />
        </div>
      </div>
    </header>
  );
}
