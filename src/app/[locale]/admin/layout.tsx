import { getAdminSession } from "@/lib/admin-auth";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  const role = session?.role || null;

  return (
    <AdminLayoutClient adminRole={role}>
      {children}
    </AdminLayoutClient>
  );
}
