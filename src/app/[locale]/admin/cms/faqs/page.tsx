"use client";

import { useState, useEffect } from "react";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Trash2, Plus } from "lucide-react";
import { getAdminFAQs, createAdminFAQ, deleteAdminFAQ } from "@/actions/admin/website-cms";
import { toast } from "sonner";

export default function FaqsAdminPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [qEn, setQEn] = useState("");
  const [aEn, setAEn] = useState("");
  const [qGu, setQGu] = useState("");
  const [aGu, setAGu] = useState("");

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      const data = await getAdminFAQs();
      setFaqs(data);
    } catch (err) {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdminFAQ({ qEn, aEn, qGu, aGu });
      toast.success("FAQ added");
      setQEn("");
      setAEn("");
      setQGu("");
      setAGu("");
      loadFaqs();
    } catch (err) {
      toast.error("Failed to add FAQ");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteAdminFAQ(id);
      toast.success("Deleted successfully");
      loadFaqs();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary" /> Manage FAQs
        </h2>

        <form onSubmit={handleCreate} className="mb-8 bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-700">English</h3>
              <Input required placeholder="Question (EN)" value={qEn} onChange={(e) => setQEn(e.target.value)} />
              <Textarea required placeholder="Answer (EN)" value={aEn} onChange={(e) => setAEn(e.target.value)} />
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-slate-700">Gujarati</h3>
              <Input required placeholder="Question (GU)" value={qGu} onChange={(e) => setQGu(e.target.value)} />
              <Textarea required placeholder="Answer (GU)" value={aGu} onChange={(e) => setAGu(e.target.value)} />
            </div>
          </div>
          <Button type="submit" className="bg-primary text-slate-950 hover:bg-primary/90 mt-4">
            <Plus className="w-4 h-4 mr-2" /> Add FAQ
          </Button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {faqs.map((f) => {
              const en = f.translations.find((t: any) => t.language === 'en');
              const gu = f.translations.find((t: any) => t.language === 'gu');
              return (
                <div key={f.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">EN: </span>
                        <span>{en?.question}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">GU: </span>
                        <span>{gu?.question}</span>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(f.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            {faqs.length === 0 && <p className="text-center text-slate-500">No FAQs found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
