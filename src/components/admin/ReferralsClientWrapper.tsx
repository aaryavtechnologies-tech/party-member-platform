"use client";

import { useRef, useState } from "react";
import { Network, Award, TrendingUp, Download, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ReferralsClientWrapperProps {
  totalReferrals: number;
  activePromoters: number;
  conversionRate: string | number;
  statusDistribution: { name: string; value: number }[];
  monthlyTrend: { name: string; value: number }[];
  topReferrers: { id: string; name: string; count: number; image?: string | null }[];
}

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

export default function ReferralsClientWrapper({
  totalReferrals,
  activePromoters,
  conversionRate,
  statusDistribution,
  monthlyTrend,
  topReferrers
}: ReferralsClientWrapperProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    const toastId = toast.loading("Generating PDF Report...");

    try {
      // Small delay to ensure all charts are fully rendered
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: document.documentElement.classList.contains("dark") ? "#0f172a" : "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Referral_Report_${new Date().toISOString().split("T")[0]}.pdf`);

      toast.success("PDF Downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to generate PDF. Please try again.", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={handleDownloadPDF}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90 transition-colors disabled:opacity-70"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Export to PDF
        </button>
      </div>

      {/* Main Report Container for PDF Export */}
      <div ref={reportRef} className="space-y-6 p-4 -m-4 bg-white dark:bg-slate-950 rounded-2xl">
        
        {/* Metric Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Referrals</span>
              <Network className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{totalReferrals.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Promoters</span>
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{activePromoters.toLocaleString()}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Conversion Rate</span>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{conversionRate}%</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Monthly Trend Chart */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Referral Trend (Last 6 Months)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#64748b", fontSize: 12 }} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#64748b", fontSize: 12 }} 
                  />
                  <RechartsTooltip 
                    cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", backgroundColor: "#ffffff" }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution Chart */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Referral Status</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution.length > 0 ? statusDistribution : [{ name: "No Data", value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", backgroundColor: "#ffffff" }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "12px", color: "#64748b" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Referrers Leaderboard */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Top Referrers Leaderboard
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rank</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Member</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Referrals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {topReferrers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-500">
                      No referrals found.
                    </td>
                  </tr>
                ) : (
                  topReferrers.map((referrer, index) => (
                    <tr key={referrer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                          index === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          index === 1 ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' :
                          index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                          'bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400'
                        }`}>
                          #{index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center">
                            {referrer.image ? (
                              <img src={referrer.image} alt={referrer.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                                {referrer.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{referrer.name}</p>
                            <p className="text-xs text-slate-500">Member ID: {referrer.id.substring(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-black text-lg text-primary">{referrer.count}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
