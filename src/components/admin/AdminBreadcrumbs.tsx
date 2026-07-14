"use client";

import { usePathname, Link } from "@/i18n/routing";
import { ChevronRight, Home } from "lucide-react";

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  
  // Example pathname: /admin/membership/upgrades
  // We split and ignore the first element (empty) and 'admin' if we want it as root
  const paths = pathname.split("/").filter(p => p !== "");
  
  // Find index of admin
  const adminIndex = paths.indexOf("admin");
  const relevantPaths = adminIndex !== -1 ? paths.slice(adminIndex + 1) : paths;

  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6 px-1">
      <Link href="/admin/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
        <Home className="w-4 h-4" />
      </Link>
      
      {relevantPaths.map((path, index) => {
        const href = "/admin/" + relevantPaths.slice(0, index + 1).join("/");
        const isLast = index === relevantPaths.length - 1;
        
        // Format path (capitalize, replace dashes)
        const formattedPath = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

        return (
          <div key={path} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700" />
            {isLast ? (
              <span className="font-semibold text-slate-900 dark:text-white">{formattedPath}</span>
            ) : (
              <Link href={href} className="hover:text-primary transition-colors">
                {formattedPath}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
