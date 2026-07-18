"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, User, Award, CreditCard, 
  Users, LogOut, Shield, QrCode
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useTranslations } from "next-intl";

// Note: Moved NAV_ITEMS into the component to use translations


export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const pathname = usePathname();
  const t = useTranslations("dashboard.sidebar");

  const NAV_ITEMS = [
    { title: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { title: t("profile"), href: "/dashboard/profile", icon: User },
    { title: t("membership"), href: "/dashboard/membership", icon: Shield },
    { title: t("digitalCard"), href: "/dashboard/card", icon: Award },
    { title: t("certificate"), href: "/dashboard/certificate", icon: QrCode },
    { title: t("referrals"), href: "/dashboard/referrals", icon: Users },
    { title: t("payments"), href: "/dashboard/payments", icon: CreditCard },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed lg:static top-0 left-0 z-50 w-72 h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out",
        !isOpen && "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-black text-2xl tracking-tighter text-primary">
              RAVP<span className="text-slate-900 dark:text-white">PORTAL</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.endsWith(item.href); // Simple active state
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary text-slate-950 shadow-md shadow-primary/20" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-slate-950" : "text-slate-400")} />
                {item.title}
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
            {t("logout")}
          </button>
        </div>
      </aside>
    </>
  );
}
