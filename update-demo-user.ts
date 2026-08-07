import 'dotenv/config';
import { prisma } from './src/lib/prisma';

async function main() {
  const email = 'member@demo.com';
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: { memberProfile: true }
  });

  if (!user) {
    console.log(`User ${email} not found.`);
    return;
  }

  if (user.memberProfile) {
    await prisma.memberProfile.update({
      where: { id: user.memberProfile.id },
      data: {
        membershipType: 'LIFETIME_ACTIVE',
        status: 'ACTIVE'
      }
    });
    console.log('Updated MemberProfile to LIFETIME_ACTIVE and ACTIVE');
  } else {
    console.log('User has no MemberProfile.');
  }

  // Create a successful payment if none exists
  const paymentCount = await prisma.payment.count({
    where: { userId: user.id, status: 'SUCCESS' }
  });

  if (paymentCount === 0) {
    await prisma.payment.create({
      data: {
        userId: user.id,
        razorpayOrderId: 'demo_order_' + Date.now(),
        razorpayPaymentId: 'demo_payment_' + Date.now(),
        amount: 100000,
        status: 'SUCCESS',
        upgradeTo: 'LIFETIME_ACTIVE',
        currency: 'INR'
      }
    });
    console.log('Created successful payment record.');
  } else {
    console.log('User already has a successful payment.');
  }

  console.log('Done!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
