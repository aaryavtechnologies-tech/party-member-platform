import 'dotenv/config';
import { prisma } from './src/lib/prisma';
import bcryptjs from 'bcryptjs';

async function main() {
  const email = 'info@rashtriyaannadatavikasparty.org';
  const password = 'ravp@2225099';

  const admin = await prisma.admin.findFirst({
    where: { 
      OR: [
        { email: email },
        { username: email }
      ]
    }
  });

  if (!admin) {
    console.log(`Admin not found. Creating ${email} as SUPER_ADMIN...`);
    const hashedPassword = await bcryptjs.hash(password, 10);
    
    await prisma.admin.create({
      data: {
        fullName: 'Super Admin',
        email: email,
        username: email,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
      }
    });
    console.log(`Successfully created ${email} as SUPER_ADMIN!`);
  } else {
    const hashedPassword = await bcryptjs.hash(password, 10);
    await prisma.admin.update({
      where: { id: admin.id },
      data: { 
        role: 'SUPER_ADMIN',
        password: hashedPassword 
      }
    });
    console.log(`Successfully updated existing ${email} to SUPER_ADMIN with new password!`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
