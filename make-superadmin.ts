import { prisma } from './src/lib/prisma';
import bcryptjs from 'bcryptjs';

async function main() {
  const admin = await prisma.admin.findFirst({
    where: { 
      OR: [
        { email: 'admin@gmail.com' },
        { username: 'admin@gmail.com' }
      ]
    }
  });

  if (!admin) {
    console.log('Admin not found. Creating admin@gmail.com as SUPER_ADMIN...');
    const hashedPassword = await bcryptjs.hash('admin123', 10);
    
    await prisma.admin.create({
      data: {
        fullName: 'Super Admin',
        email: 'admin@gmail.com',
        username: 'admin@gmail.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
      }
    });
    console.log('Successfully created admin@gmail.com with password admin123 as SUPER_ADMIN!');
  } else {
    await prisma.admin.update({
      where: { id: admin.id },
      data: { role: 'SUPER_ADMIN' }
    });
    console.log('Successfully updated existing admin@gmail.com to SUPER_ADMIN!');
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
