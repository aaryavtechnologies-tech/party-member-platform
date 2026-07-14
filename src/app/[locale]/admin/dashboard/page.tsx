"use client";

import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import { Users, UserCheck, CreditCard, LifeBuoy, ArrowUpRight, Activity } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, LineChart, Line 
} from "recharts";

const data = [
  { name: 'Jan', members: 400 },
  { name: 'Feb', members: 300 },
  { name: 'Mar', members: 200 },
  { name: 'Apr', members: 278 },
  { name: 'May', members: 189 },
  { name: 'Jun', members: 239 },
  { name: 'Jul', members: 349 },
];

const revenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome to the RAVP Admin Portal.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors">
            Download Report
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatsCard 
          title="Total Members" 
          value="124,592" 
          icon={Users} 
          trend="+12% this month" 
          trendUp={true} 
        />
        <AdminStatsCard 
          title="Active Lifetime" 
          value="8,405" 
          icon={UserCheck} 
          trend="+5% this month" 
          trendUp={true} 
        />
        <AdminStatsCard 
          title="Total Revenue" 
          value="₹45.2L" 
          icon={CreditCard} 
          trend="+18% this month" 
          trendUp={true} 
        />
        <AdminStatsCard 
          title="Open Tickets" 
          value="42" 
          icon={LifeBuoy} 
          trend="-2% this month" 
          trendUp={false} 
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">New Registrations</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="members" fill="#fb923c" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Revenue Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="revenue" stroke="#fb923c" strokeWidth={3} dot={{ r: 4, fill: '#fb923c', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Third Row: Lists */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activities</h3>
            <button className="text-sm font-semibold text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Himanshu Kumar upgraded to Lifetime Primary</p>
                  <p className="text-xs text-slate-500">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            {[
              { title: "Review Pending Approvals", count: 12 },
              { title: "Respond to Tickets", count: 5 },
              { title: "Publish New Announcement", count: 0 },
            ].map((action, i) => (
              <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                  {action.title}
                </span>
                {action.count > 0 ? (
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{action.count}</span>
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                )}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
