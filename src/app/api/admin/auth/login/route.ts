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
    let redirectUrl = "/admin/dashboard"; // Fallback/Super Admin
    if (admin.role === "NATIONAL_ADMIN") redirectUrl = "/admin/national";
    else if (admin.role === "STATE_ADMIN") redirectUrl = "/admin/state";
    else if (admin.role === "DISTRICT_ADMIN") redirectUrl = "/admin/district";
    else if (admin.role === "TALUKA_ADMIN") redirectUrl = "/admin/taluka";
    else if (admin.role === "VILLAGE_ADMIN") redirectUrl = "/admin/village";

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
