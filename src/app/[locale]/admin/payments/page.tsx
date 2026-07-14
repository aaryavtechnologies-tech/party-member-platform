"use client";

import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import { CreditCard, IndianRupee, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area
} from "recharts";

const revenueData = [
  { name: 'Jan', revenue: 45000, refunds: 1000 },
  { name: 'Feb', revenue: 52000, refunds: 2000 },
  { name: 'Mar', revenue: 61000, refunds: 1500 },
  { name: 'Apr', revenue: 49000, refunds: 3000 },
  { name: 'May', revenue: 78000, refunds: 1000 },
  { name: 'Jun', revenue: 84000, refunds: 2500 },
  { name: 'Jul', revenue: 92000, refunds: 1200 },
];

const methodData = [
  { name: 'UPI', value: 65 },
  { name: 'Cards', value: 25 },
  { name: 'NetBanking', value: 10 },
];

export default function PaymentDashboardPage() {
  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Financial Dashboard</h1>
          <p className="text-slate-500">Monitor platform revenue, upgrades, and transactions.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AdminStatsCard 
          title="Total Revenue" 
          value="₹4,52,000" 
          icon={IndianRupee} 
          trend="+18% vs last month" 
          trendUp={true} 
          className="p-4 sm:p-6" 
        />
        <AdminStatsCard 
          title="Today's Revenue" 
          value="₹12,400" 
          icon={TrendingUp} 
          trend="+5% vs yesterday" 
          trendUp={true} 
          className="p-4 sm:p-6" 
        />
        <AdminStatsCard 
          title="Successful" 
          value="1,452" 
          icon={CheckCircle} 
          trend="94% Success Rate" 
          trendUp={true} 
          className="p-4 sm:p-6" 
        />
        <AdminStatsCard 
          title="Failed" 
          value="42" 
          icon={XCircle} 
          trend="Needs Attention" 
          trendUp={false} 
          className="p-4 sm:p-6" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Growth</h3>
            <select className="h-8 px-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md outline-none">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Payment Methods</h3>
          <div className="flex-1 flex flex-col justify-center gap-6">
            {methodData.map((method) => (
              <div key={method.name}>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{method.name}</span>
                  <span className="text-sm text-slate-500">{method.value}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${method.value}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" /> Manage Gateway
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
