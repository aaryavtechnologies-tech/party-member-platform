"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth, canManageRole } from "@/lib/rbac";
import bcryptjs from "bcryptjs";
import { AdminRole } from "@prisma/client";

export async function getAdmins() {
  const session = await requireAdminAuth();

  // Super Admins can see all other admins
  if (session.role === "SUPER_ADMIN") {
    return prisma.admin.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  // Other admins can only see admins they created
  return prisma.admin.findMany({
    where: { createdById: session.id },
    orderBy: { createdAt: "desc" }
  });
}

export async function createAdmin(data: {
  fullName: string;
  email: string;
  mobile: string;
  username: string;
  passwordRaw: string;
  role: AdminRole;
  state?: string;
  district?: string;
  taluka?: string;
  village?: string;
}) {
  const session = await requireAdminAuth();

  // 1. Verify Role Hierarchy
  if (!canManageRole(session.role, data.role)) {
    throw new Error(`Unauthorized: ${session.role} cannot create a ${data.role}`);
  }

  // 2. Validate Location Inheritance
  // A State admin can only create District admins IN THEIR STATE.
  if (session.state && data.state !== session.state) {
    throw new Error(`Unauthorized: You can only create admins in ${session.state}`);
  }
  if (session.district && data.district !== session.district) {
    throw new Error(`Unauthorized: You can only create admins in ${session.district}`);
  }
  if (session.taluka && data.taluka !== session.taluka) {
    throw new Error(`Unauthorized: You can only create admins in ${session.taluka}`);
  }

  // 3. Hash Password
  const hashedPassword = await bcryptjs.hash(data.passwordRaw, 10);

  // 4. Create Admin
  return prisma.admin.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      username: data.username,
      password: hashedPassword,
      role: data.role,
      country: "India",
      state: data.state,
      district: data.district,
      taluka: data.taluka,
      village: data.village,
      createdById: session.id,
    }
  });
}

export async function deleteAdmin(adminId: string) {
  const session = await requireAdminAuth();

  const targetAdmin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!targetAdmin) throw new Error("Admin not found");

  if (session.role !== "SUPER_ADMIN" && targetAdmin.createdById !== session.id) {
    throw new Error("Unauthorized: You can only delete admins you created.");
  }

  await prisma.admin.delete({ where: { id: adminId } });
  return { success: true };
}
