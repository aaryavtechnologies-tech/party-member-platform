"use client";

import { useState, useEffect } from "react";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Trash2, Plus } from "lucide-react";
import { getAdminCoreValues, createAdminCoreValue, deleteAdminCoreValue } from "@/actions/admin/website-cms";
import { toast } from "sonner";

export default function CoreValuesAdminPage() {
  const [values, setValues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [titleKey, setTitleKey] = useState("");
  const [icon, setIcon] = useState("Heart");

  useEffect(() => {
    loadValues();
  }, []);

  const loadValues = async () => {
    try {
      const data = await getAdminCoreValues();
      setValues(data);
    } catch (err) {
      toast.error("Failed to load core values");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdminCoreValue({ titleKey, icon });
      toast.success("Core Value added");
      setTitleKey("");
      setIcon("Heart");
      loadValues();
    } catch (err) {
      toast.error("Failed to add core value");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteAdminCoreValue(id);
      toast.success("Deleted successfully");
      loadValues();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" /> Manage Core Values
        </h2>

        <form onSubmit={handleCreate} className="flex gap-4 mb-8 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex-1">
            <Input required placeholder="Translation Key (e.g., transparency)" value={titleKey} onChange={(e) => setTitleKey(e.target.value)} />
          </div>
          <div className="flex-1">
            <Input required placeholder="Lucide Icon (e.g., Heart, Eye)" value={icon} onChange={(e) => setIcon(e.target.value)} />
          </div>
          <Button type="submit" className="bg-primary text-slate-950 hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-3">
            {values.map((v) => (
              <div key={v.id} className="flex justify-between items-center p-4 border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-900 dark:text-white">{v.titleKey}</span>
                  <span className="text-sm text-slate-500">Icon: {v.icon}</span>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(v.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {values.length === 0 && <p className="text-center text-slate-500">No core values found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
