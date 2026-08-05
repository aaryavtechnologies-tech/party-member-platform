const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const existingSuperAdmin = await prisma.admin.findFirst({
    where: { role: 'SUPER_ADMIN' }
  });

  if (existingSuperAdmin) {
    console.log('Super Admin already exists:', existingSuperAdmin.username);
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const superAdmin = await prisma.admin.create({
    data: {
      fullName: 'System Super Admin',
      email: 'superadmin@ravp.org',
      mobile: '9999999999',
      username: 'superadmin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      country: 'India',
      status: 'ACTIVE'
    }
  });

  console.log('Created Super Admin:', superAdmin.username);
  console.log('Password: admin123');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
