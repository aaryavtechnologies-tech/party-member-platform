import { requireAdminAuth } from "@/lib/rbac";
import { getAdmins } from "@/actions/admin/users";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { ShieldCheck, UserPlus } from "lucide-react";
import AdminUsersClient from "./AdminUsersClient";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const session = await requireAdminAuth("TALUKA_ADMIN"); // Village admins can't access this
  const admins = await getAdmins();

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Admin Management
          </h1>
          <p className="text-slate-500">Manage subordinate administrators and their permissions.</p>
        </div>
      </div>

      <AdminUsersClient initialAdmins={admins} currentRole={session.role} currentState={session.state} currentDistrict={session.district} currentTaluka={session.taluka} />
    </div>
  );
}
