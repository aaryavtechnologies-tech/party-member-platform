import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Admin, AdminRole } from "@prisma/client";

const rawSecret = process.env.ADMIN_JWT_SECRET;
if (!rawSecret || rawSecret.length < 32) {
  throw new Error(
    "[Security] ADMIN_JWT_SECRET is not set or is too short (minimum 32 characters). " +
    "Set it in your environment variables before starting the server."
  );
}
const SECRET_KEY = new TextEncoder().encode(rawSecret);

export type AdminJwtPayload = {
  id: string;
  role: AdminRole;
  state?: string | null;
  district?: string | null;
  taluka?: string | null;
  village?: string | null;
};

export async function createAdminSession(admin: Admin) {
  const payload: AdminJwtPayload = {
    id: admin.id,
    role: admin.role,
    state: admin.state,
    district: admin.district,
    taluka: admin.taluka,
    village: admin.village,
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET_KEY);

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Hardened: was 'lax' — strict prevents CSRF via cross-site navigations
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours (was 24h — reduced attack window)
  });
}

export async function getAdminSession(): Promise<AdminJwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as AdminJwtPayload;
  } catch (error) {
    return null;
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
