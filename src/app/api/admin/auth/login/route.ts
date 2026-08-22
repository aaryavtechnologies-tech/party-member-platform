import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { createAdminSession } from "@/lib/admin-auth";

// SECURITY: Strict in-memory rate limiter for admin login
// For multi-instance production, replace with Redis/Upstash
const loginAttempts = new Map<string, { count: number; windowStart: number; blockedUntil?: number }>();

const LOGIN_MAX_ATTEMPTS = 10;        // 10 attempts
const LOGIN_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minute lockout after max attempts

function checkAdminLoginRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (record?.blockedUntil && now < record.blockedUntil) {
    const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  if (!record || now - record.windowStart > LOGIN_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (record.count >= LOGIN_MAX_ATTEMPTS) {
    const blockedUntil = now + LOCKOUT_DURATION_MS;
    loginAttempts.set(ip, { ...record, blockedUntil });
    console.warn(`[Admin Login] IP ${ip} locked out after ${LOGIN_MAX_ATTEMPTS} failed attempts`);
    return { allowed: false, retryAfterSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000) };
  }

  record.count += 1;
  return { allowed: true };
}

function clearLoginAttempts(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(req: NextRequest) {
  // SECURITY: Rate limit admin login strictly — 5 attempts per 10 minutes per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateLimitResult = checkAdminLoginRateLimit(ip);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimitResult.retryAfterSeconds ?? 900),
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Basic length validation to prevent abuse
    if (typeof username !== "string" || username.length > 100) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length > 200) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const admin = await prisma.admin.findFirst({
      where: {
        OR: [{ username: username.trim() }, { email: username.trim() }],
      },
    });

    // SECURITY: Use a consistent error message to prevent username enumeration
    // Always perform bcrypt compare even if admin not found (to prevent timing attacks)
    const dummyHash = "$2a$10$dummy.hash.to.prevent.timing.attacks.on.user.enumeration";
    const passwordToCheck = admin?.password ?? dummyHash;
    const isValid = await bcryptjs.compare(password, passwordToCheck);

    if (!admin || !admin.isActive || !isValid) {
      // SECURITY: Generic error message — does not reveal if username exists or account is inactive
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Successful login — clear rate limit record
    clearLoginAttempts(ip);

    // Update login history
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    });

    await createAdminSession(admin);

    // Determine dashboard URL based on role
    let redirectUrl = "/admin/members";
    if (admin.role === "SUPER_ADMIN") {
      redirectUrl = "/super-admin/dashboard";
    }

    return NextResponse.json({
      success: true,
      redirectUrl,
      role: admin.role,
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    // SECURITY: Don't expose internal error details
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
