"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Inbox,
  Building2,
  Share2,
  HelpCircle,
  FileEdit,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Trash2,
  Download,
  Plus,
  RefreshCw,
  TrendingUp,
  MapPin,
  Save,
  Phone,
  Mail,
  Globe,
  Loader2,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const CHART_COLORS = ["#166534", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6"];

export default function AdminContactPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "inquiries" | "office" | "social" | "faqs" | "content">("dashboard");

  // State for Dashboard Analytics
  const [dashLoading, setDashLoading] = useState(true);
  const [dashStats, setDashStats] = useState<any>({
    total: 0,
    todayCount: 0,
    newCount: 0,
    pendingCount: 0,
    inProgressCount: 0,
    repliedCount: 0,
    closedCount: 0,
    avgResponseTimeHours: "0 hrs",
  });
  const [dashCharts, setDashCharts] = useState<any>({
    dailyTrends: [],
    stateDistribution: [],
    categoryDistribution: [],
  });

  // State for Inquiries Management
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inqLoading, setInqLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [updatingInquiry, setUpdatingInquiry] = useState(false);

  // State for CMS Settings
  const [cmsData, setCmsData] = useState<any>({
    office: {},
    socialLinks: [],
    faqs: [],
    settings: {},
  });
  const [cmsLoading, setCmsLoading] = useState(false);
  const [savingCms, setSavingCms] = useState(false);
  const [cmsSuccessMsg, setCmsSuccessMsg] = useState("");

  // FAQ Form State
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [faqForm, setFaqForm] = useState({
    questionEn: "",
    questionGu: "",
    answerEn: "",
    answerGu: "",
  });

  // Load Dashboard Data
  const fetchDashboard = async () => {
    setDashLoading(true);
    try {
      const res = await fetch("/api/contact/admin/dashboard");
      const data = await res.json();
      if (data.success) {
        setDashStats(data.stats);
        setDashCharts(data.charts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDashLoading(false);
    }
  };

  // Load Inquiries List
  const fetchInquiries = async () => {
    setInqLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (priorityFilter !== "ALL") params.append("priority", priorityFilter);

      const res = await fetch(`/api/contact/admin/inquiries?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInqLoading(false);
    }
  };

  // Load CMS Settings
  const fetchCmsSettings = async () => {
    setCmsLoading(true);
    try {
      const res = await fetch("/api/contact/settings");
      const data = await res.json();
      if (data.success) {
        setCmsData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCmsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchInquiries();
    fetchCmsSettings();
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [search, statusFilter, priorityFilter]);

  // Handle Inquiry Status Update & Reply
  const handleUpdateInquiryStatus = async (status: string, replyMessage?: string) => {
    if (!selectedInquiry) return;
    setUpdatingInquiry(true);
    try {
      const res = await fetch("/api/contact/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedInquiry.id,
          status,
          replyNotes: replyMessage || selectedInquiry.replyNotes,
          actionLog: {
            action: status === "REPLIED" ? "REPLIED" : "STATUS_CHANGED",
            performedBy: "Admin User",
            remarks: replyMessage ? `Replied: ${replyMessage}` : `Status updated to ${status}`,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedInquiry(data.inquiry);
        fetchInquiries();
        fetchDashboard();
        if (replyMessage) setReplyText("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingInquiry(false);
    }
  };

  // Save Office CMS
  const handleSaveOffice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCms(true);
    setCmsSuccessMsg("");

    try {
      const res = await fetch("/api/contact/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "OFFICE",
          payload: cmsData.office,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCmsSuccessMsg("Headquarters details saved successfully!");
        setTimeout(() => setCmsSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCms(false);
    }
  };

  // Save Social Links CMS
  const handleSaveSocial = async () => {
    setSavingCms(true);
    setCmsSuccessMsg("");

    try {
      const res = await fetch("/api/contact/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "SOCIAL_LINKS",
          payload: cmsData.socialLinks,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCmsSuccessMsg("Social media links saved successfully!");
        setTimeout(() => setCmsSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCms(false);
    }
  };

  // Save FAQ
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCms(true);

    try {
      const action = editingFaq ? "UPDATE" : "CREATE";
      const payload = {
        action,
        id: editingFaq?.id,
        ...faqForm,
      };

      const res = await fetch("/api/contact/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "FAQ", payload }),
      });

      const data = await res.json();
      if (data.success) {
        setFaqModalOpen(false);
        setEditingFaq(null);
        setFaqForm({ questionEn: "", questionGu: "", answerEn: "", answerGu: "" });
        fetchCmsSettings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCms(false);
    }
  };

  // Save Page Settings (Hero, Intro, Motto, Commitment)
  const handleSavePageSetting = async (key: string, value: any) => {
    setSavingCms(true);
    try {
      const res = await fetch("/api/contact/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "SETTING",
          payload: { key, value },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCmsSuccessMsg(`${key} content saved successfully!`);
        setTimeout(() => setCmsSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCms(false);
    }
  };

  // Export CSV Functionality
  const exportInquiriesCsv = () => {
    if (inquiries.length === 0) return;
    const headers = ["Inquiry ID", "Full Name", "Mobile", "Email", "State", "District", "Taluka", "Subject", "Status", "Date"];
    const rows = inquiries.map((i) => [
      i.inquiryId,
      `"${i.fullName}"`,
      i.mobileNumber,
      i.email,
      i.state,
      i.district,
      i.taluka,
      `"${i.subject}"`,
      i.status,
      new Date(i.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `RAVP_Inquiries_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Contact & Inquiry Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage public inquiries, headquarters details, social links, FAQs, and contact page CMS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchDashboard();
              fetchInquiries();
              fetchCmsSettings();
            }}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={exportInquiriesCsv}
            className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-md hover:scale-105 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-200 dark:border-slate-800">
        {[
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "inquiries", label: "Inquiries Desk", icon: Inbox, badge: dashStats.newCount },
          { id: "office", label: "Headquarters & Hours", icon: Building2 },
          { id: "social", label: "Social Links", icon: Share2 },
          { id: "faqs", label: "FAQ CMS", icon: HelpCircle },
          { id: "content", label: "Page Content CMS", icon: FileEdit },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2.5 relative ${
                isActive
                  ? "bg-green-700 text-white shadow-md shadow-green-700/20"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Global Success Notification */}
      {cmsSuccessMsg && (
        <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-950/80 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 font-bold text-sm flex items-center gap-3 animate-fade-in shadow-md">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600" />
          <span>{cmsSuccessMsg}</span>
        </div>
      )}

      {/* TAB 1: DASHBOARD & ANALYTICS */}
      {activeTab === "dashboard" && (
        <div className="space-y-8 animate-fade-in">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md">
              <div className="text-xs font-bold uppercase text-slate-400">Total Inquiries</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {dashStats.total}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md">
              <div className="text-xs font-bold uppercase text-amber-500">Today's New</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
                {dashStats.todayCount}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md">
              <div className="text-xs font-bold uppercase text-blue-500">Pending</div>
              <div className="text-2xl sm:text-3xl font-black text-blue-500 mt-1">
                {dashStats.pendingCount}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md">
              <div className="text-xs font-bold uppercase text-purple-500">In Progress</div>
              <div className="text-2xl sm:text-3xl font-black text-purple-500 mt-1">
                {dashStats.inProgressCount}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md">
              <div className="text-xs font-bold uppercase text-green-600">Replied</div>
              <div className="text-2xl sm:text-3xl font-black text-green-600 mt-1">
                {dashStats.repliedCount}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md">
              <div className="text-xs font-bold uppercase text-slate-400">Avg Response</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {dashStats.avgResponseTimeHours}
              </div>
            </div>
          </div>

          {/* Recharts Graphical Analytics */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Daily Trends Chart (8 Cols) */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>Daily Inquiries Trend (Last 7 Days)</span>
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashCharts.dailyTrends}>
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff" }}
                    />
                    <Bar dataKey="inquiries" fill="#166534" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Pie Chart (4 Cols) */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
                Inquiry Categories
              </h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashCharts.categoryDistribution.length > 0 ? dashCharts.categoryDistribution : [{ name: "General", value: 1 }]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {dashCharts.categoryDistribution.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1">
                {dashCharts.categoryDistribution.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                      <span>{item.name}</span>
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INQUIRIES DESK */}
      {activeTab === "inquiries" && (
        <div className="space-y-6 animate-fade-in">
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by ID, name, mobile, email, subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">New</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REPLIED">Replied</option>
                <option value="CLOSED">Closed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {/* Inquiries Data Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl">
            {inqLoading ? (
              <div className="py-20 text-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-green-600" />
                <span>Loading inquiries data...</span>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Inbox className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                <h3 className="font-bold text-lg text-slate-700 dark:text-slate-300">No inquiries found</h3>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or status filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="p-4">Ref ID</th>
                      <th className="p-4">Full Name</th>
                      <th className="p-4">Contact Info</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-950/50 transition-colors">
                        <td className="p-4 font-extrabold text-green-700 dark:text-green-400">
                          {inquiry.inquiryId}
                        </td>
                        <td className="p-4 text-slate-900 dark:text-white font-bold">
                          {inquiry.fullName}
                        </td>
                        <td className="p-4 space-y-0.5">
                          <div className="text-slate-900 dark:text-slate-200">{inquiry.mobileNumber}</div>
                          <div className="text-xs text-slate-400 truncate max-w-[160px]">{inquiry.email}</div>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-300">
                          {inquiry.district}, {inquiry.state}
                        </td>
                        <td className="p-4 text-slate-800 dark:text-slate-200 font-semibold max-w-[180px] truncate">
                          {inquiry.subject}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                              inquiry.status === "NEW"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300"
                                : inquiry.status === "REPLIED"
                                ? "bg-green-100 text-green-800 dark:bg-green-950/80 dark:text-green-300"
                                : inquiry.status === "CLOSED"
                                ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300"
                            }`}
                          >
                            {inquiry.status}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="px-3 py-1.5 rounded-lg bg-green-700 hover:bg-green-600 text-white font-bold text-xs transition-colors"
                          >
                            View & Reply
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inquiry Detail Modal / Drawer */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-extrabold text-green-600 tracking-wide uppercase">Inquiry Ticket</span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {selectedInquiry.inquiryId}
                </h2>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Full Name</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{selectedInquiry.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Mobile</span>
                <a href={`tel:${selectedInquiry.mobileNumber}`} className="font-bold text-green-600">
                  {selectedInquiry.mobileNumber}
                </a>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Email</span>
                <a href={`mailto:${selectedInquiry.email}`} className="font-bold text-slate-900 dark:text-white">
                  {selectedInquiry.email}
                </a>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Location</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedInquiry.taluka}, {selectedInquiry.district}, {selectedInquiry.state}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Subject</span>
              <div className="font-extrabold text-slate-900 dark:text-white text-base">
                {selectedInquiry.subject}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Public Message</span>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap border border-slate-200 dark:border-slate-800">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Status Change & Reply Form */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400">Change Status</span>
                <div className="flex gap-2">
                  {["NEW", "PENDING", "IN_PROGRESS", "REPLIED", "CLOSED"].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateInquiryStatus(st)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        selectedInquiry.status === st
                          ? "bg-green-700 text-white shadow-md"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Add Internal Note / Official Response
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type official response or internal team note..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300"
                >
                  Close
                </button>

                <button
                  onClick={() => handleUpdateInquiryStatus("REPLIED", replyText)}
                  disabled={updatingInquiry}
                  className="px-5 py-2 rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Save & Mark Replied</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HEADQUARTERS & WORKING HOURS CMS */}
      {activeTab === "office" && (
        <form onSubmit={handleSaveOffice} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 space-y-6 shadow-xl animate-fade-in">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-green-600" />
            <span>Manage Central Headquarters Information</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Office Name (English)</label>
              <input
                type="text"
                value={cmsData.office?.officeNameEn || ""}
                onChange={(e) => setCmsData({ ...cmsData, office: { ...cmsData.office, officeNameEn: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Office Name (Gujarati)</label>
              <input
                type="text"
                value={cmsData.office?.officeNameGu || ""}
                onChange={(e) => setCmsData({ ...cmsData, office: { ...cmsData.office, officeNameGu: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Address (English)</label>
              <textarea
                rows={2}
                value={cmsData.office?.addressEn || ""}
                onChange={(e) => setCmsData({ ...cmsData, office: { ...cmsData.office, addressEn: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Address (Gujarati)</label>
              <textarea
                rows={2}
                value={cmsData.office?.addressGu || ""}
                onChange={(e) => setCmsData({ ...cmsData, office: { ...cmsData.office, addressGu: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Phone Number</label>
              <input
                type="text"
                value={cmsData.office?.phone || ""}
                onChange={(e) => setCmsData({ ...cmsData, office: { ...cmsData.office, phone: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                value={cmsData.office?.email || ""}
                onChange={(e) => setCmsData({ ...cmsData, office: { ...cmsData.office, email: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Website URL</label>
              <input
                type="text"
                value={cmsData.office?.website || ""}
                onChange={(e) => setCmsData({ ...cmsData, office: { ...cmsData.office, website: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Google Maps Direct Link</label>
              <input
                type="text"
                value={cmsData.office?.googleMapUrl || ""}
                onChange={(e) => setCmsData({ ...cmsData, office: { ...cmsData.office, googleMapUrl: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Google Maps Embed iFrame URL</label>
              <input
                type="text"
                value={cmsData.office?.embedMapUrl || ""}
                onChange={(e) => setCmsData({ ...cmsData, office: { ...cmsData.office, embedMapUrl: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={savingCms}
              className="px-6 py-3 rounded-xl bg-green-700 hover:bg-green-600 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Office Details</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: SOCIAL LINKS CMS */}
      {activeTab === "social" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 space-y-6 shadow-xl animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-amber-500" />
              <span>Manage Social Media Links & Handles</span>
            </h2>
            <button
              onClick={handleSaveSocial}
              disabled={savingCms}
              className="px-5 py-2.5 rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save All Social Links</span>
            </button>
          </div>

          <div className="space-y-4">
            {cmsData.socialLinks?.map((item: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-[180px]">
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {item.platformNameEn}
                  </span>
                </div>

                <input
                  type="text"
                  placeholder="https://... (Leave empty for 'Coming Soon')"
                  value={item.url || ""}
                  onChange={(e) => {
                    const updated = [...cmsData.socialLinks];
                    updated[idx].url = e.target.value;
                    setCmsData({ ...cmsData, socialLinks: updated });
                  }}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
                />

                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 shrink-0">
                  <input
                    type="checkbox"
                    checked={item.isEnabled !== false}
                    onChange={(e) => {
                      const updated = [...cmsData.socialLinks];
                      updated[idx].isEnabled = e.target.checked;
                      setCmsData({ ...cmsData, socialLinks: updated });
                    }}
                    className="w-4 h-4 accent-green-600 rounded"
                  />
                  <span>Enabled</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: FAQ CMS */}
      {activeTab === "faqs" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 space-y-6 shadow-xl animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              <span>Manage Frequently Asked Questions (Bilingual)</span>
            </h2>
            <button
              onClick={() => {
                setEditingFaq(null);
                setFaqForm({ questionEn: "", questionGu: "", answerEn: "", answerGu: "" });
                setFaqModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {cmsData.faqs?.map((faq: any, idx: number) => (
              <div key={faq.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {faq.questionEn}
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-400 mt-0.5">
                    {faq.questionGu}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingFaq(faq);
                      setFaqForm({
                        questionEn: faq.questionEn,
                        questionGu: faq.questionGu,
                        answerEn: faq.answerEn,
                        answerGu: faq.answerGu,
                      });
                      setFaqModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 text-xs font-bold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={async () => {
                      if (!confirm("Are you sure you want to delete this FAQ?")) return;
                      await fetch("/api/contact/admin/settings", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ type: "FAQ", payload: { action: "DELETE", id: faq.id } }),
                      });
                      fetchCmsSettings();
                    }}
                    className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 hover:bg-rose-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal for Add / Edit FAQ */}
          {faqModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
              <form onSubmit={handleSaveFaq} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-4 shadow-2xl">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  {editingFaq ? "Edit FAQ Item" : "Create New FAQ"}
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Question (English)</label>
                  <input
                    type="text"
                    required
                    value={faqForm.questionEn}
                    onChange={(e) => setFaqForm({ ...faqForm, questionEn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Question (Gujarati)</label>
                  <input
                    type="text"
                    required
                    value={faqForm.questionGu}
                    onChange={(e) => setFaqForm({ ...faqForm, questionGu: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Answer (English)</label>
                  <textarea
                    rows={3}
                    required
                    value={faqForm.answerEn}
                    onChange={(e) => setFaqForm({ ...faqForm, answerEn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Answer (Gujarati)</label>
                  <textarea
                    rows={3}
                    required
                    value={faqForm.answerGu}
                    onChange={(e) => setFaqForm({ ...faqForm, answerGu: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setFaqModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-xs"
                  >
                    Save FAQ
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: PAGE CONTENT CMS */}
      {activeTab === "content" && (
        <div className="space-y-8 animate-fade-in">
          {/* Hero Content CMS */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Hero Section CMS</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Title (English)</label>
                <input
                  type="text"
                  defaultValue={cmsData.settings?.hero?.titleEn || "Contact Us"}
                  id="heroTitleEn"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Title (Gujarati)</label>
                <input
                  type="text"
                  defaultValue={cmsData.settings?.hero?.titleGu || "અમારો સંપર્ક કરો"}
                  id="heroTitleGu"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Subtitle (English)</label>
                <input
                  type="text"
                  defaultValue={cmsData.settings?.hero?.subtitleEn || "Your Contact, Our Trust – Always With You For Public Service"}
                  id="heroSubtitleEn"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Subtitle (Gujarati)</label>
                <input
                  type="text"
                  defaultValue={cmsData.settings?.hero?.subtitleGu || "આપનો સંપર્ક, અમારો વિશ્વાસ – જનસેવા માટે હંમેશા આપની સાથે"}
                  id="heroSubtitleGu"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                />
              </div>
            </div>
            <button
              onClick={() => {
                const titleEn = (document.getElementById("heroTitleEn") as HTMLInputElement).value;
                const titleGu = (document.getElementById("heroTitleGu") as HTMLInputElement).value;
                const subtitleEn = (document.getElementById("heroSubtitleEn") as HTMLInputElement).value;
                const subtitleGu = (document.getElementById("heroSubtitleGu") as HTMLInputElement).value;
                handleSavePageSetting("contact_hero", { titleEn, titleGu, subtitleEn, subtitleGu });
              }}
              className="px-5 py-2 rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-xs"
            >
              Save Hero Settings
            </button>
          </div>

          {/* Motto Content CMS */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Party Motto CMS</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Line 1 (English)</label>
                <input
                  type="text"
                  defaultValue={cmsData.settings?.motto?.textEnLine1 || "Your Voice, Our Trust."}
                  id="mottoEn1"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Line 2 (English)</label>
                <input
                  type="text"
                  defaultValue={cmsData.settings?.motto?.textEnLine2 || "Public Connection Creates Public Trust."}
                  id="mottoEn2"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Line 1 (Gujarati)</label>
                <input
                  type="text"
                  defaultValue={cmsData.settings?.motto?.textGuLine1 || "આપનો અવાજ, અમારો વિશ્વાસ."}
                  id="mottoGu1"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Line 2 (Gujarati)</label>
                <input
                  type="text"
                  defaultValue={cmsData.settings?.motto?.textGuLine2 || "જનસંપર્કથી જનવિશ્વાસ, જનવિશ્વાસથી સમૃદ્ધ ભારત."}
                  id="mottoGu2"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                />
              </div>
            </div>
            <button
              onClick={() => {
                const textEnLine1 = (document.getElementById("mottoEn1") as HTMLInputElement).value;
                const textEnLine2 = (document.getElementById("mottoEn2") as HTMLInputElement).value;
                const textGuLine1 = (document.getElementById("mottoGu1") as HTMLInputElement).value;
                const textGuLine2 = (document.getElementById("mottoGu2") as HTMLInputElement).value;
                handleSavePageSetting("contact_motto", { textEnLine1, textEnLine2, textGuLine1, textGuLine2 });
              }}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Save Motto Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
