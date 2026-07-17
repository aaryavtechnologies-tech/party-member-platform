/**
 * Seed Script: Creates Admin + Demo Member accounts
 * Run: npx tsx prisma/seed.ts
 */

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "@better-auth/utils/password";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function createUser(opts: {
  name: string;
  email: string;
  password: string;
  role: string;
  withMemberProfile?: boolean;
}) {
  const existing = await prisma.user.findUnique({ where: { email: opts.email } });

  if (existing) {
    // Ensure role is correct
    await prisma.user.update({
      where: { email: opts.email },
      data: { role: opts.role, emailVerified: true },
    });
    return { existed: true, user: existing };
  }

  const hashedPass = await hashPassword(opts.password);
  const userId = crypto.randomUUID();

  const userData: any = {
    id: userId,
    name: opts.name,
    email: opts.email,
    emailVerified: true,
    role: opts.role,
    accounts: {
      create: {
        accountId: opts.email,
        providerId: "credential",
        provider: "credential",
      },
    },
  };

  // Create user without password first, then update the account with the password
  const user = await prisma.user.create({ data: userData });

  // Update the account to set password
  await prisma.account.updateMany({
    where: { userId: user.id, providerId: "credential" },
    data: { password: hashedPass } as any,
  });

  if (opts.withMemberProfile) {
    const existingMobile = await prisma.memberProfile.findUnique({ where: { mobile: "9876543210" } });
    const existingMemberId = await prisma.memberProfile.findUnique({ where: { memberId: "RAVP-2026-000001" } });

    await prisma.memberProfile.create({
      data: {
        userId: user.id,
        memberId: existingMemberId ? `RAVP-DEMO-${Date.now()}` : "RAVP-2026-000001",
        fatherName: "Rameshbhai Demo",
        gender: "Male",
        dob: new Date("1990-06-15"),
        mobile: existingMobile ? `987654${Math.floor(1000 + Math.random() * 9000)}` : "9876543210",
        state: "Gujarat",
        district: "Rajkot",
        taluka: "Paddhari",
        village: "Govindpar",
        fullAddress: "123, Gandhi Nagar, Near Temple, Govindpar",
        pincode: "360110",
        referralCode: `RAVPDEMO${Math.floor(100000 + Math.random() * 900000)}`,
        membershipType: "PRIMARY",
        status: "ACTIVE",
      },
    });
  }

  return { existed: false, user };
}

async function main() {
  console.log("\n🌱 Seeding demo accounts...\n");

  // ─── ADMIN ───
  const adminResult = await createUser({
    name: "Super Admin",
    email: "admin@gmail.com",
    password: "admin123",
    role: "ADMIN",
  });

  if (adminResult.existed) {
    console.log("✅ Admin already existed — role updated to ADMIN");
  } else {
    console.log("✅ Admin created — ID:", adminResult.user.id);
  }
  console.log("   📧  Email    : admin@gmail.com");
  console.log("   🔑  Password : admin123");
  console.log("   👑  Role     : ADMIN\n");

  // ─── DEMO MEMBER ───
  const memberResult = await createUser({
    name: "Demo Member",
    email: "member@demo.com",
    password: "member123",
    role: "USER",
    withMemberProfile: true,
  });

  if (memberResult.existed) {
    console.log("✅ Demo member already existed — skipping");
  } else {
    const profile = await prisma.memberProfile.findUnique({ where: { userId: memberResult.user.id } });
    console.log("✅ Demo member created — ID:", memberResult.user.id, "| Member ID:", profile?.memberId);
  }
  console.log("   📧  Email    : member@demo.com");
  console.log("   🔑  Password : member123");
  console.log("   👤  Role     : USER\n");

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  🎉 Done! Login at: http://localhost:3001/en/membership/login");
  console.log("  ADMIN  → admin@gmail.com  / admin123");
  console.log("  MEMBER → member@demo.com  / member123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
