import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  children?: ReactNode;
}

export function AdminStatsCard({ title, value, icon: Icon, trend, trendUp, className, children }: AdminStatsCardProps) {
  return (
    <div className={cn("p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col", className)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
        </div>
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      
      {(trend || children) && (
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          {trend && (
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs font-bold px-2 py-1 rounded-md",
                trendUp ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
              )}>
                {trend}
              </span>
              <span className="text-xs text-slate-500 font-medium">vs last month</span>
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
