"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminRole } from "@prisma/client";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  adminRole: AdminRole | null;
}

export function AdminLayoutClient({ children, adminRole }: AdminLayoutClientProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname.includes("/admin/login");

  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-900">{children}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 font-sans">
      
      {/* Sidebar Navigation */}
      <AdminSidebar 
        isMobileOpen={isMobileSidebarOpen} 
        setMobileOpen={setIsMobileSidebarOpen} 
        adminRole={adminRole}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <AdminTopbar setMobileOpen={setIsMobileSidebarOpen} adminRole={adminRole} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto scrollbar-hide p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}
