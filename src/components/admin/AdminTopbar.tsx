"use client";

import { Button } from "@/components/ui/button";
import { Search, Bell, Menu, Moon, Sun, Monitor, LogOut, Settings, User as UserIcon } from "lucide-react";
import { Link } from "@/i18n/routing";

export function AdminTopbar({ setMobileOpen }: { setMobileOpen: (v: boolean) => void }) {
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
            placeholder="Search members, transactions, tickets..." 
            className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        
        {/* Language Switcher (Mock) */}
        <select className="hidden sm:block h-9 px-3 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium outline-none">
          <option>English</option>
          <option>Gujarati</option>
          <option>Hindi</option>
        </select>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-950" />
        </Button>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2" />

        {/* Admin Profile Dropdown (Simplified for layout) */}
        <div className="flex items-center gap-3 cursor-pointer group p-1 pr-3 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
            A
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Admin User</p>
            <p className="text-xs text-slate-500">Superadmin</p>
          </div>
        </div>

      </div>
    </header>
  );
}
