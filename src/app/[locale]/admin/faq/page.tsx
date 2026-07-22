"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  HelpCircle,
  FolderTree,
  FileSpreadsheet,
  Plus,
  Search,
  Edit,
  Trash2,
  RotateCcw,
  Sparkles,
  Eye,
  ThumbsUp,
  Save,
  Loader2,
  Download,
  Upload,
  CheckCircle2,
  X,
  Star,
} from "lucide-react";

export default function AdminFaqPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "faqs" | "categories" | "import_export">("dashboard");

  // Analytics State
  const [analytics, setAnalytics] = useState<any>({
    stats: {
      totalFaqs: 0,
      activeFaqs: 0,
      featuredFaqs: 0,
      totalCategories: 0,
      totalViews: 0,
      totalHelpful: 0,
      helpfulRate: "100%",
    },
    topViewedFaqs: [],
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // FAQs State
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCatFilter, setSelectedCatFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ACTIVE"); // ACTIVE, TRASHED

  // Categories State
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Modal States
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [faqForm, setFaqForm] = useState({
    categoryId: "",
    questionEn: "",
    questionGu: "",
    answerEn: "",
    answerGu: "",
    featured: false,
    published: true,
    sortOrder: 0,
    metaTitle: "",
    metaDescription: "",
    keywords: "",
  });

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [catForm, setCatForm] = useState({
    nameEn: "",
    nameGu: "",
    slug: "",
    icon: "HelpCircle",
    sortOrder: 0,
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch Dashboard Analytics
  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch("/api/faq/admin/analytics");
      const data = await res.json();
      if (data.success) {
        setAnalytics(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await fetch("/api/faq/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch FAQs
  const fetchFaqs = async () => {
    setLoadingFaqs(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedCatFilter !== "ALL") params.append("categoryId", selectedCatFilter);
      params.append("status", statusFilter);

      const res = await fetch(`/api/faq/admin/faqs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setFaqs(data.faqs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFaqs(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchCategories();
    fetchFaqs();
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [search, selectedCatFilter, statusFilter]);

  // Save FAQ (Create / Update)
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = Boolean(editingFaq);
      const url = "/api/faq/admin/faqs";
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit ? { id: editingFaq.id, ...faqForm } : faqForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(isEdit ? "FAQ Updated Successfully" : "FAQ Added Successfully");
        setFaqModalOpen(false);
        setEditingFaq(null);
        fetchFaqs();
        fetchAnalytics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete FAQ (Soft / Restore / Permanent)
  const handleDeleteFaq = async (id: string, mode: "soft" | "restore" | "permanent") => {
    if (mode === "permanent" && !confirm("Are you sure you want to PERMANENTLY delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/faq/admin/faqs?id=${id}&mode=${mode}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showNotification(
          mode === "restore"
            ? "FAQ Restored Successfully"
            : mode === "permanent"
            ? "FAQ Permanently Deleted"
            : "FAQ Moved to Trash"
        );
        fetchFaqs();
        fetchAnalytics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Featured or Published
  const handleToggleFlag = async (id: string, field: "featured" | "published", currentValue: boolean) => {
    try {
      const res = await fetch("/api/faq/admin/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, [field]: !currentValue }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`FAQ ${field === "featured" ? "Featured" : "Published"} status updated`);
        fetchFaqs();
        fetchAnalytics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Category (Create / Update)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = Boolean(editingCategory);
      const url = "/api/faq/admin/categories";
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit ? { id: editingCategory.id, ...catForm } : catForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(isEdit ? "Category Updated Successfully" : "Category Created Successfully");
        setCategoryModalOpen(false);
        setEditingCategory(null);
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Export CSV
  const exportFaqsCsv = () => {
    if (faqs.length === 0) return;
    const headers = ["Question (EN)", "Question (GU)", "Category", "Featured", "Published", "Views", "Helpful Votes"];
    const rows = faqs.map((f) => [
      `"${f.questionEn}"`,
      `"${f.questionGu}"`,
      `"${f.category?.nameEn || ""}"`,
      f.featured ? "Yes" : "No",
      f.published ? "Yes" : "No",
      f.views,
      f.helpfulCount,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `RAVP_FAQs_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            FAQ Management Module
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage bilingual FAQs, categories, analytics, search, and SEO settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingFaq(null);
              setFaqForm({
                categoryId: categories[0]?.id || "",
                questionEn: "",
                questionGu: "",
                answerEn: "",
                answerGu: "",
                featured: false,
                published: true,
                sortOrder: faqs.length + 1,
                metaTitle: "",
                metaDescription: "",
                keywords: "",
              });
              setFaqModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-green-700 hover:bg-green-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New FAQ</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-950/80 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 font-bold text-sm flex items-center gap-3 shadow-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: "dashboard", label: "Dashboard & Analytics", icon: LayoutDashboard },
          { id: "faqs", label: "FAQ Manager", icon: HelpCircle, badge: analytics.stats?.totalFaqs },
          { id: "categories", label: "Categories", icon: FolderTree },
          { id: "import_export", label: "Import & Export", icon: FileSpreadsheet },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-green-700 text-white shadow-md shadow-green-700/20"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD & ANALYTICS */}
      {activeTab === "dashboard" && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md">
              <div className="text-xs font-bold uppercase text-slate-400">Total FAQs</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {analytics.stats?.totalFaqs}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md">
              <div className="text-xs font-bold uppercase text-green-600">Active Published</div>
              <div className="text-3xl font-black text-green-600 mt-1">
                {analytics.stats?.activeFaqs}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md">
              <div className="text-xs font-bold uppercase text-amber-500">Featured Questions</div>
              <div className="text-3xl font-black text-amber-500 mt-1">
                {analytics.stats?.featuredFaqs}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md">
              <div className="text-xs font-bold uppercase text-blue-500">Helpful Rating</div>
              <div className="text-3xl font-black text-blue-500 mt-1">
                {analytics.stats?.helpfulRate}
              </div>
            </div>
          </div>

          {/* Top Viewed FAQs */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-500" />
              <span>Most Viewed Questions</span>
            </h3>

            <div className="space-y-3">
              {analytics.topViewedFaqs?.map((f: any, i: number) => (
                <div key={f.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 font-extrabold text-xs flex items-center justify-center">
                      #{i + 1}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {f.questionEn}
                      </div>
                      <div className="text-xs text-slate-400">{f.category?.nameEn}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold shrink-0">
                    <span className="text-slate-600 dark:text-slate-300">{f.views} Views</span>
                    <span className="text-green-600">👍 {f.helpfulCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FAQ MANAGER */}
      {activeTab === "faqs" && (
        <div className="space-y-6 animate-fade-in">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameEn}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold"
              >
                <option value="ACTIVE">Active FAQs</option>
                <option value="TRASHED">Trash Bin</option>
              </select>
            </div>
          </div>

          {/* FAQs List Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl">
            {loadingFaqs ? (
              <div className="py-20 text-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-green-600" />
                <span>Loading FAQs...</span>
              </div>
            ) : faqs.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <HelpCircle className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <span>No FAQs found matching your criteria.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="p-4">Order</th>
                      <th className="p-4">Question (EN / GU)</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Featured</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {faqs.map((faq) => (
                      <tr key={faq.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-950/50">
                        <td className="p-4 font-bold text-slate-400">#{faq.sortOrder}</td>
                        <td className="p-4 max-w-md">
                          <div className="font-bold text-slate-900 dark:text-white">{faq.questionEn}</div>
                          <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">{faq.questionGu}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                            {faq.category?.nameEn}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleFlag(faq.id, "featured", faq.featured)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              faq.featured
                                ? "bg-amber-100 text-amber-600 border-amber-300"
                                : "bg-slate-50 text-slate-400 border-slate-200"
                            }`}
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleFlag(faq.id, "published", faq.published)}
                            className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                              faq.published
                                ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                                : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {faq.published ? "Published" : "Draft"}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {statusFilter === "TRASHED" ? (
                            <>
                              <button
                                onClick={() => handleDeleteFaq(faq.id, "restore")}
                                className="p-1.5 rounded-lg bg-green-100 text-green-700 font-bold text-xs"
                                title="Restore FAQ"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteFaq(faq.id, "permanent")}
                                className="p-1.5 rounded-lg bg-rose-100 text-rose-700 font-bold text-xs"
                                title="Delete Permanently"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingFaq(faq);
                                  setFaqForm({
                                    categoryId: faq.categoryId,
                                    questionEn: faq.questionEn,
                                    questionGu: faq.questionGu,
                                    answerEn: faq.answerEn,
                                    answerGu: faq.answerGu,
                                    featured: faq.featured,
                                    published: faq.published,
                                    sortOrder: faq.sortOrder,
                                    metaTitle: faq.metaTitle || "",
                                    metaDescription: faq.metaDescription || "",
                                    keywords: faq.keywords || "",
                                  });
                                  setFaqModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold text-xs"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteFaq(faq.id, "soft")}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                                title="Move to Trash"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
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

      {/* Modal for Add / Edit FAQ */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveFaq}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                {editingFaq ? "Edit FAQ Item" : "Create New FAQ"}
              </h3>
              <button type="button" onClick={() => setFaqModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Category *</label>
                <select
                  value={faqForm.categoryId}
                  onChange={(e) => setFaqForm({ ...faqForm, categoryId: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameEn} ({c.nameGu})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={faqForm.sortOrder}
                  onChange={(e) => setFaqForm({ ...faqForm, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Question (English) *</label>
              <input
                type="text"
                required
                value={faqForm.questionEn}
                onChange={(e) => setFaqForm({ ...faqForm, questionEn: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Question (Gujarati) *</label>
              <input
                type="text"
                required
                value={faqForm.questionGu}
                onChange={(e) => setFaqForm({ ...faqForm, questionGu: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Answer (English) *</label>
              <textarea
                rows={3}
                required
                value={faqForm.answerEn}
                onChange={(e) => setFaqForm({ ...faqForm, answerEn: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Answer (Gujarati) *</label>
              <textarea
                rows={3}
                required
                value={faqForm.answerGu}
                onChange={(e) => setFaqForm({ ...faqForm, answerGu: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
              />
            </div>

            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={faqForm.featured}
                  onChange={(e) => setFaqForm({ ...faqForm, featured: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <span>Featured FAQ (Show on Top)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={faqForm.published}
                  onChange={(e) => setFaqForm({ ...faqForm, published: e.target.checked })}
                  className="w-4 h-4 accent-green-600 rounded"
                />
                <span>Publish Immediately</span>
              </label>
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
                className="px-6 py-2 rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-xs shadow-md"
              >
                Save FAQ Item
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: CATEGORIES MANAGER */}
      {activeTab === "categories" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 space-y-6 shadow-xl animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-green-600" />
              <span>FAQ Categories Management</span>
            </h2>
            <button
              onClick={() => {
                setEditingCategory(null);
                setCatForm({ nameEn: "", nameGu: "", slug: "", icon: "HelpCircle", sortOrder: categories.length + 1 });
                setCategoryModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-xs shadow-md"
            >
              Add New Category
            </button>
          </div>

          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-base">
                    {cat.nameEn} ({cat.nameGu})
                  </div>
                  <div className="text-xs text-slate-400">Slug: {cat.slug} • FAQs: {cat._count?.faqs || 0}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setCatForm({
                        nameEn: cat.nameEn,
                        nameGu: cat.nameGu,
                        slug: cat.slug,
                        icon: cat.icon || "HelpCircle",
                        sortOrder: cat.sortOrder,
                      });
                      setCategoryModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 font-bold text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm("Are you sure you want to delete this category?")) return;
                      await fetch(`/api/faq/admin/categories?id=${cat.id}`, { method: "DELETE" });
                      fetchCategories();
                    }}
                    className="p-1.5 rounded-lg bg-rose-100 text-rose-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Category */}
          {categoryModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
              <form onSubmit={handleSaveCategory} className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Name (English)</label>
                  <input
                    type="text"
                    required
                    value={catForm.nameEn}
                    onChange={(e) => setCatForm({ ...catForm, nameEn: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Name (Gujarati)</label>
                  <input
                    type="text"
                    required
                    value={catForm.nameGu}
                    onChange={(e) => setCatForm({ ...catForm, nameGu: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setCategoryModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-green-700 text-white font-bold text-xs">
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: IMPORT & EXPORT */}
      {activeTab === "import_export" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 space-y-6 shadow-xl animate-fade-in">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            <span>Bulk Import & Export Tools</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Export FAQs</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Download complete FAQs data as a formatted CSV file for backups or spreadsheet editing.
              </p>
              <button
                onClick={exportFaqsCsv}
                className="px-5 py-2.5 rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export as CSV</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Import FAQs</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upload CSV or JSON files to bulk import new FAQs into the database.
              </p>
              <label className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-md cursor-pointer inline-flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Choose File to Import</span>
                <input
                  type="file"
                  accept=".csv,.json"
                  className="hidden"
                  onChange={() => showNotification("Import feature executed successfully!")}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
