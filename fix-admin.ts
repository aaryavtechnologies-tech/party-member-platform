import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "@better-auth/utils/password";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "admin@gmail.com" } });
  if (!user) return console.log("No admin");

  const hashedPass = await hashPassword("admin123");
  
  const account = await prisma.account.findFirst({
    where: { userId: user.id, providerId: "credential" }
  });

  if (account) {
    await prisma.account.update({
      where: { id: account.id },
      data: { password: hashedPass }
    });
    console.log("✅ Updated existing account password for Admin");
  } else {
    await prisma.account.create({
      data: {
        userId: user.id,
        providerId: "credential",
        accountId: "admin@gmail.com",
        provider: "credential",
        password: hashedPass
      }
    });
    console.log("✅ Created account with password for Admin");
  }

  // Also do it for member@demo.com just in case
  const member = await prisma.user.findUnique({ where: { email: "member@demo.com" } });
  if (member) {
    const hashedMemberPass = await hashPassword("member123");
    const memberAcc = await prisma.account.findFirst({
      where: { userId: member.id, providerId: "credential" }
    });
    if (memberAcc) {
      await prisma.account.update({
        where: { id: memberAcc.id },
        data: { password: hashedMemberPass }
      });
      console.log("✅ Updated existing account password for Demo Member");
    }
  }
}

main().finally(() => {
  prisma.$disconnect();
  pool.end();
});
