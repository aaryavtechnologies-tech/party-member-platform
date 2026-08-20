"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";

export async function logoutAdmin() {
  // Read session BEFORE deleting the cookie so we know where to redirect
  const session = await getAdminSession();
  const isSuperAdmin = session?.role === "SUPER_ADMIN";

  const cookieStore = await cookies();
  cookieStore.delete("admin_session");

  if (isSuperAdmin) {
    redirect("/super-admin-login");
  } else {
    redirect("/admin/login");
  }
}
