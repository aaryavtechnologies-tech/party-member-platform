"use client";

import { Menu } from "lucide-react";
import { AdminRole } from "@prisma/client";
import { usePathname } from "next/navigation";

export function AdminTopbar({ 
  setMobileOpen,
  adminRole = null
}: { 
  setMobileOpen: (v: boolean) => void;
  adminRole?: AdminRole | null;
}) {
  const pathname = usePathname();
  
  // Extract and format the last segment of the URL for the page name
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || 'dashboard';
  const pageName = lastSegment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  return (
    <header className="h-16 shrink-0 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 sm:px-6 sticky top-0 z-30">
      
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white capitalize">
          {pageName}
        </h1>
      </div>

    </header>
  );
}
