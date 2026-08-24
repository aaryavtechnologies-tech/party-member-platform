"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Users, IndianRupee, Clock, ShieldCheck } from "lucide-react";

interface AnalyticsData {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  totalRevenue: number; // in Rupees
  membersByTier: { name: string; value: number }[];
  membersByStatus: { name: string; value: number }[];
}

interface AnalyticsClientWrapperProps {
  data: AnalyticsData;
}

const COLORS = ["#16a34a", "#2563eb", "#d97706", "#dc2626", "#9333ea"];

export function AnalyticsClientWrapper({ data }: AnalyticsClientWrapperProps) {
  const cards = [
    {
      title: "Total Members",
      value: data.totalMembers.toLocaleString(),
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Active Members",
      value: data.activeMembers.toLocaleString(),
      icon: ShieldCheck,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      title: "Pending Approval",
      value: data.pendingMembers.toLocaleString(),
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Total Revenue",
      value: `₹${data.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((stat, i) => (
          <div
            key={i}
            className={`rounded-2xl border bg-white dark:bg-slate-900/40 p-6 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-lg dark:hover:shadow-black/20 ${stat.border}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{stat.title}</span>
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Membership Tier Distribution */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 backdrop-blur-xl p-6 h-96 flex flex-col shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Membership Tiers</h3>
          <div className="flex-1 min-h-0 w-full">
            {data.membersByTier.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.membersByTier}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.membersByTier.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "12px", color: "#fff" }}
                    itemStyle={{ color: "#fff", fontWeight: "bold" }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "12px", fontWeight: "bold" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">No Data Available</div>
            )}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 backdrop-blur-xl p-6 h-96 flex flex-col shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Status Overview</h3>
          <div className="flex-1 min-h-0 w-full">
            {data.membersByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.membersByStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "#1e293b", opacity: 0.4 }}
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "12px", color: "#fff" }}
                  />
                  <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={40}>
                    {data.membersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">No Data Available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
