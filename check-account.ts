import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "admin@gmail.com" } });
  if (!user) {
    console.log("Admin user not found in DB.");
    return;
  }
  
  const accounts = await prisma.account.findMany({ where: { userId: user.id } });
  console.log("Accounts for Admin:", JSON.stringify(accounts, null, 2));
}

main().finally(() => {
  prisma.$disconnect();
  pool.end();
});
