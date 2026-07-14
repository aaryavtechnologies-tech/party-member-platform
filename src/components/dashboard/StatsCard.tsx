import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, className }: StatsCardProps) {
  return (
    <div className={cn("p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={cn(
            "text-sm font-semibold px-2.5 py-1 rounded-full",
            trendUp ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
          )}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
