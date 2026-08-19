import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { createAdminSession } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username }
        ]
      }
    });

    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: "Invalid credentials or inactive account" }, { status: 401 });
    }

    const isValid = await bcryptjs.compare(password, admin.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Update login history (simple tracking)
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    });

    await createAdminSession(admin);

    // Determine dashboard URL based on role
    let redirectUrl = "/admin/members"; // Default for non-super admins
    if (admin.role === "SUPER_ADMIN") {
      redirectUrl = "/super-admin/dashboard";
    }

    return NextResponse.json({ 
      success: true, 
      redirectUrl,
      role: admin.role
    });

  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
