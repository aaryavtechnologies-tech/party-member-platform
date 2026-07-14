"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { 
  ChevronDown, ChevronRight, LayoutDashboard, Users, UserPlus, 
  MapPin, Globe, FileText, Settings, ShieldAlert, CreditCard, 
  PieChart, LifeBuoy, Bell, History, Menu, FileEdit
} from "lucide-react";

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
      { title: "Upgrades", href: "/admin/membership/upgrades", icon: UserPlus },
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
      { title: "Homepage", href: "/admin/cms/home", icon: FileEdit },
      { title: "About Pages", href: "/admin/cms/about", icon: FileText },
      { title: "Policies", href: "/admin/cms/policies", icon: FileText },
      { title: "News & Media", href: "/admin/news", icon: Globe },
      { title: "Gallery", href: "/admin/gallery", icon: Globe },
      { title: "Events", href: "/admin/events", icon: Globe },
    ]
  },
  {
    label: "Finance",
    items: [
      { title: "Payments", href: "/admin/payments", icon: CreditCard },
      { title: "Invoices", href: "/admin/finance/invoices", icon: FileText },
    ]
  },
  {
    label: "Reports & Analytics",
    items: [
      { title: "Analytics Overview", href: "/admin/reports", icon: PieChart },
      { title: "Member Reports", href: "/admin/reports/members", icon: Users },
      { title: "Referral Reports", href: "/admin/reports/referrals", icon: Users },
    ]
  },
  {
    label: "Support",
    items: [
      { title: "Support Tickets", href: "/admin/support", icon: LifeBuoy },
    ]
  },
  {
    label: "Administration",
    items: [
      { title: "Roles & Permissions", href: "/admin/roles", icon: ShieldAlert },
      { title: "System Settings", href: "/admin/settings", icon: Settings },
      { title: "Audit Logs", href: "/admin/logs", icon: History },
    ]
  }
];

export function AdminSidebar({ isMobileOpen, setMobileOpen }: { isMobileOpen: boolean; setMobileOpen: (v: boolean) => void }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Initialize from local storage on mount
  useEffect(() => {
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
    "fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-950 text-slate-300 transition-all duration-300 lg:static lg:translate-x-0 border-r border-slate-800",
    isCollapsed ? "w-20" : "w-72",
    isMobileOpen ? "translate-x-0" : "-translate-x-full"
  );

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
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-slate-800">
          <Link href="/admin/dashboard" className={cn("flex items-center gap-3 overflow-hidden", isCollapsed && "justify-center")}>
            <div className="w-8 h-8 rounded-lg bg-primary shrink-0 flex items-center justify-center">
              <span className="text-slate-950 font-black text-xs">RV</span>
            </div>
            {!isCollapsed && <span className="font-bold text-white text-lg tracking-tight whitespace-nowrap">Admin Portal</span>}
          </Link>
          <button 
            onClick={toggleSidebar} 
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          <div className="space-y-6 px-3">
            {ADMIN_NAV_CONFIG.map((group, i) => (
              <div key={i} className="flex flex-col">
                {!isCollapsed ? (
                  <button 
                    onClick={() => toggleGroup(group.label)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {group.label}
                    {expandedGroups[group.label] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                ) : (
                  <div className="w-full border-t border-slate-800 my-2" />
                )}

                <div className={cn("flex flex-col space-y-1 mt-1", (!expandedGroups[group.label] && !isCollapsed) && "hidden")}>
                  {group.items.map((item, j) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon || LayoutDashboard;
                    
                    return (
                      <Link 
                        key={j} 
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl transition-colors group relative",
                          isCollapsed ? "justify-center p-3" : "px-3 py-2.5",
                          isActive 
                            ? "bg-primary text-slate-950 font-semibold" 
                            : "hover:bg-slate-800/50 hover:text-white"
                        )}
                        title={isCollapsed ? item.title : undefined}
                      >
                        <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-slate-950" : "text-slate-400 group-hover:text-slate-300")} />
                        {!isCollapsed && <span className="truncate">{item.title}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
