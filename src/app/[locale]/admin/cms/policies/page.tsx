"use client";

import { useState, useEffect } from "react";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, Trash2, Plus } from "lucide-react";
import { getAdminPolicies, createAdminPolicy, deleteAdminPolicy } from "@/actions/admin/website-cms";
import { toast } from "sonner";

export default function PoliciesAdminPage() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [titleEn, setTitleEn] = useState("");
  const [descEn, setDescEn] = useState("");
  const [titleGu, setTitleGu] = useState("");
  const [descGu, setDescGu] = useState("");

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const data = await getAdminPolicies();
      setPolicies(data);
    } catch (err) {
      toast.error("Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdminPolicy({ titleEn, descEn, titleGu, descGu });
      toast.success("Policy added");
      setTitleEn("");
      setDescEn("");
      setTitleGu("");
      setDescGu("");
      loadPolicies();
    } catch (err) {
      toast.error("Failed to add policy");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteAdminPolicy(id);
      toast.success("Deleted successfully");
      loadPolicies();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary" /> Manage Policies
        </h2>

        <form onSubmit={handleCreate} className="mb-8 bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-700">English</h3>
              <Input required placeholder="Policy Title (EN)" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
              <Textarea required placeholder="Description (EN)" value={descEn} onChange={(e) => setDescEn(e.target.value)} />
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-slate-700">Gujarati</h3>
              <Input required placeholder="Policy Title (GU)" value={titleGu} onChange={(e) => setTitleGu(e.target.value)} />
              <Textarea required placeholder="Description (GU)" value={descGu} onChange={(e) => setDescGu(e.target.value)} />
            </div>
          </div>
          <Button type="submit" className="bg-primary text-slate-950 hover:bg-primary/90 mt-4">
            <Plus className="w-4 h-4 mr-2" /> Add Policy
          </Button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {policies.map((p) => {
              const en = p.translations.find((t: any) => t.language === 'en');
              const gu = p.translations.find((t: any) => t.language === 'gu');
              return (
                <div key={p.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">EN: </span>
                        <span className="font-semibold">{en?.title}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">GU: </span>
                        <span className="font-semibold">{gu?.title}</span>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            {policies.length === 0 && <p className="text-center text-slate-500">No policies found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
