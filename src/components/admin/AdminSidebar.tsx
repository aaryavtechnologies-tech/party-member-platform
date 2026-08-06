"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { 
  ChevronDown, ChevronRight, LayoutDashboard, Users, UserPlus, 
  MapPin, Globe, FileText, Settings, ShieldAlert, CreditCard, 
  PieChart, LifeBuoy, Bell, History, Menu, FileEdit, Send, LogOut
} from "lucide-react";
import { logoutAdmin } from "@/actions/admin/auth";

type NavItem = {
  title: string;
  href: string;
  icon?: React.ElementType;
  requiredPermission?: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const ADMIN_NAV_CONFIG: NavGroup[] = [
  {
    label: "Dashboard",
    items: [
      { title: "Overview", href: "/admin/dashboard", icon: LayoutDashboard }
    ]
  },
  {
    label: "Member Management",
    items: [
      { title: "All Members", href: "/admin/members", icon: Users },
      { title: "Membership Plans", href: "/admin/membership/plans", icon: FileText },
    ]
  },
  {
    label: "Organization",
    items: [
      { title: "National Team", href: "/admin/organization/national", icon: Globe },
      { title: "State Team", href: "/admin/organization/state", icon: MapPin },
      { title: "District Team", href: "/admin/organization/district", icon: MapPin },
      { title: "Taluka Team", href: "/admin/organization/taluka", icon: MapPin },
      { title: "Village Team", href: "/admin/organization/village", icon: MapPin },
    ]
  },
  {
    label: "Content Management",
    items: [
      { title: "Website Pages (CMS)", href: "/admin/cms/pages", icon: FileEdit },
      { title: "FAQ Management", href: "/admin/faq", icon: LifeBuoy },
      { title: "News & Media", href: "/admin/news", icon: Globe },
      { title: "Gallery", href: "/admin/gallery", icon: Globe },
      { title: "Events", href: "/admin/events", icon: Globe },
    ]
  },
  {
    label: "Finance",
    items: [
      { title: "Payments", href: "/admin/payments", icon: CreditCard },
    ]
  },
  {
    label: "Reports & Analytics",
    items: [
      { title: "Analytics Overview", href: "/admin/reports", icon: PieChart },
      { title: "Member Reports", href: "/admin/reports/members", icon: Users },
      { title: "Referral Reports", href: "/admin/reports/referrals", icon: Users },
      { title: "Broadcasts & News", href: "/admin/broadcasts", icon: Send },
    ]
  },
  {
    label: "Support",
    items: [
      { title: "Contact & Inquiries", href: "/admin/contact", icon: Bell },
      { title: "Support Tickets", href: "/admin/support", icon: LifeBuoy },
    ]
  },
  {
    label: "Administration",
    items: [
      { title: "Admin Management", href: "/admin/users", icon: Users },
    ]
  }
];

import { AdminRole } from "@prisma/client";

// Define a list of groups/items only Super Admin can see
const SUPER_ADMIN_ONLY_GROUPS = ["Organization", "Finance", "Administration", "Dashboard", "Reports & Analytics"];
const SUPER_ADMIN_ONLY_ITEMS = ["Website Pages (CMS)", "FAQ Management", "Gallery", "Events", "Membership Plans"];

export function AdminSidebar({ 
  isMobileOpen, 
  setMobileOpen,
  adminRole = null
}: { 
  isMobileOpen: boolean; 
  setMobileOpen: (v: boolean) => void;
  adminRole?: AdminRole | null;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Initialize from local storage on mount
  useEffect(() => {
    setTimeout(() => {
      const savedCollapsed = localStorage.getItem("adminSidebarCollapsed");
      if (savedCollapsed) {
        setIsCollapsed(savedCollapsed === "true");
      }
      const savedGroups = localStorage.getItem("adminSidebarExpandedGroups");
      if (savedGroups) {
        setExpandedGroups(JSON.parse(savedGroups));
      } else {
        // Default to opening first group
        setExpandedGroups({ "Dashboard": true, "Member Management": true });
      }
    }, 0);
  }, []);

  const toggleSidebar = () => {
    const newVal = !isCollapsed;
    setIsCollapsed(newVal);
    localStorage.setItem("adminSidebarCollapsed", String(newVal));
  };

  const toggleGroup = (label: string) => {
    const newGroups = { ...expandedGroups, [label]: !expandedGroups[label] };
    setExpandedGroups(newGroups);
    localStorage.setItem("adminSidebarExpandedGroups", JSON.stringify(newGroups));
  };

  const sidebarClasses = cn(
    "fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl text-slate-300 transition-all duration-300 lg:static lg:translate-x-0 border-r border-slate-800/60 shadow-2xl",
    isCollapsed ? "w-20" : "w-72",
    isMobileOpen ? "translate-x-0" : "-translate-x-full"
  );

  // Filter navigation based on role
  const filteredNavConfig = ADMIN_NAV_CONFIG.map(group => {
    if (adminRole !== "SUPER_ADMIN" && SUPER_ADMIN_ONLY_GROUPS.includes(group.label)) {
      return null;
    }

    const filteredItems = group.items.filter(item => {
      if (adminRole !== "SUPER_ADMIN" && SUPER_ADMIN_ONLY_ITEMS.includes(item.title)) {
        return false;
      }
      return true;
    });

    if (filteredItems.length === 0) return null;

    // Adjust dashboard link based on role
    const adjustedItems = filteredItems.map(item => {
      if (item.title === "Overview") {
        let href = "/admin/dashboard";
        if (adminRole === "NATIONAL_ADMIN") href = "/admin/national";
        else if (adminRole === "STATE_ADMIN") href = "/admin/state";
        else if (adminRole === "DISTRICT_ADMIN") href = "/admin/district";
        else if (adminRole === "TALUKA_ADMIN") href = "/admin/taluka";
        else if (adminRole === "VILLAGE_ADMIN") href = "/admin/village";
        return { ...item, href };
      }
      return item;
    });

    return { ...group, items: adjustedItems };
  }).filter(Boolean) as NavGroup[];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      <aside className={sidebarClasses}>
        {/* Header */}
        <div className="flex h-20 shrink-0 items-center justify-between px-5 border-b border-slate-800/60 bg-slate-950/50">
          <Link href="/admin/dashboard" className={cn("flex items-center gap-3 overflow-hidden transition-all duration-300 group", isCollapsed && "justify-center")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 shrink-0 flex items-center justify-center shadow-[0_0_15px_rgba(251,146,60,0.4)] group-hover:shadow-[0_0_20px_rgba(251,146,60,0.6)] transition-all">
              <span className="text-slate-950 font-black text-sm tracking-tighter">RV</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-lg tracking-tight whitespace-nowrap leading-tight">Admin Portal</span>
                <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{adminRole ? adminRole.replace("_ADMIN", " ADMIN") : "Platform Management"}</span>
              </div>
            )}
          </Link>
          <button 
            onClick={toggleSidebar} 
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="space-y-8 px-4">
            {filteredNavConfig.map((group, i) => (
              <div key={i} className="flex flex-col">
                {!isCollapsed ? (
                  <button 
                    onClick={() => toggleGroup(group.label)}
                    className="flex items-center justify-between px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-colors group/header"
                  >
                    <span className="group-hover/header:translate-x-1 transition-transform duration-300">{group.label}</span>
                    {expandedGroups[group.label] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                ) : (
                  <div className="w-8 mx-auto border-t-2 border-slate-800/50 my-3 rounded-full" />
                )}

                <div className={cn("flex flex-col space-y-1.5 mt-2", (!expandedGroups[group.label] && !isCollapsed) && "hidden")}>
                  {group.items.map((item, j) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon || LayoutDashboard;
                    
                    return (
                      <Link 
                        key={j} 
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                          isCollapsed ? "justify-center p-3" : "px-3.5 py-3",
                          isActive 
                            ? "bg-gradient-to-r from-primary to-orange-500 text-slate-950 font-bold shadow-[0_4px_15px_rgba(251,146,60,0.3)]" 
                            : "hover:bg-slate-800/50 hover:text-white"
                        )}
                        title={isCollapsed ? item.title : undefined}
                      >
                        {isActive && !isCollapsed && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/30 rounded-r-full" />
                        )}
                        <Icon className={cn(
                          "w-5 h-5 shrink-0 transition-transform duration-300", 
                          isActive ? "text-slate-950 scale-110" : "text-slate-400 group-hover:text-primary group-hover:scale-110"
                        )} />
                        {!isCollapsed && <span className={cn("truncate transition-transform duration-300", !isActive && "group-hover:translate-x-1")}>{item.title}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <button
              onClick={() => logoutAdmin()}
              className={cn(
                "w-full flex items-center justify-start gap-3 p-3 rounded-xl font-bold text-sm transition-all text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20",
                isCollapsed && "justify-center px-0"
              )}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
