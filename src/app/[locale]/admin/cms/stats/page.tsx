"use client";

import { useState, useEffect } from "react";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Trash2, Plus } from "lucide-react";
import { getAdminStats, createAdminStat, deleteAdminStat } from "@/actions/admin/website-cms";
import { toast } from "sonner";

export default function StatsAdminPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [labelKey, setLabelKey] = useState("");
  const [value, setValue] = useState("");
  const [icon, setIcon] = useState("Users");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdminStat({ labelKey, value: parseInt(value), icon });
      toast.success("Stat added");
      setLabelKey("");
      setValue("");
      setIcon("Users");
      loadStats();
    } catch (err) {
      toast.error("Failed to add stat");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteAdminStat(id);
      toast.success("Deleted successfully");
      loadStats();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <LineChart className="w-6 h-6 text-primary" /> Manage Homepage Stats
        </h2>

        <form onSubmit={handleCreate} className="flex gap-4 mb-8 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex-1">
            <Input required placeholder="Label (e.g., active_members)" value={labelKey} onChange={(e) => setLabelKey(e.target.value)} />
          </div>
          <div className="w-32">
            <Input required type="number" placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div className="flex-1">
            <Input required placeholder="Lucide Icon (e.g., Users)" value={icon} onChange={(e) => setIcon(e.target.value)} />
          </div>
          <Button type="submit" className="bg-primary text-slate-950 hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-3">
            {stats.map((s) => (
              <div key={s.id} className="flex justify-between items-center p-4 border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-primary">{s.value}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{s.labelKey}</span>
                  <span className="text-sm text-slate-500">Icon: {s.icon}</span>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(s.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {stats.length === 0 && <p className="text-center text-slate-500">No stats found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
