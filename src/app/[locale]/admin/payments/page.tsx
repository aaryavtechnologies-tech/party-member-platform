import { prisma } from "@/lib/prisma";
import PaymentsClient from "./PaymentsClient";
import { format, subMonths, startOfMonth, endOfMonth, startOfDay, endOfDay } from "date-fns";

export default async function PaymentDashboardPage() {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  // 1. KPI Data
  const [totalRevenueObj, todayRevenueObj, successfulCount, failedCount] = await Promise.all([
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCESS" }
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { 
        status: "SUCCESS",
        createdAt: { gte: todayStart, lte: todayEnd }
      }
    }),
    prisma.payment.count({ where: { status: "SUCCESS" } }),
    prisma.payment.count({ where: { status: "FAILED" } })
  ]);

  const totalRevenue = totalRevenueObj._sum.amount || 0;
  const todayRevenue = todayRevenueObj._sum.amount || 0;
  
  const totalAttempts = successfulCount + failedCount;
  const successRate = totalAttempts > 0 
    ? Math.round((successfulCount / totalAttempts) * 100) 
    : 0;

  // 2. Revenue Growth Data (Last 6 Months)
  const revenueGrowth = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const monthName = format(date, 'MMM');

    const revObj = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { 
        status: "SUCCESS",
        createdAt: { gte: start, lte: end }
      }
    });
    // Convert paise to rupees for chart
    revenueGrowth.push({ name: monthName, revenue: (revObj._sum.amount || 0) / 100 });
  }

  // 3. Payment Methods Breakdown
  const methodGroups = await prisma.payment.groupBy({
    by: ['paymentMethod'],
    _count: { paymentMethod: true },
    where: { 
      status: "SUCCESS",
      paymentMethod: { not: null } 
    }
  });

  const validMethodsCount = methodGroups.reduce((acc, curr) => acc + curr._count.paymentMethod, 0);
  
  const paymentMethods = methodGroups
    .filter(m => m.paymentMethod !== null)
    .map(m => ({
      name: m.paymentMethod as string,
      value: validMethodsCount > 0 ? (m._count.paymentMethod / validMethodsCount) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value); // Highest first

  const paymentsData = {
    totalRevenue,
    todayRevenue,
    successfulCount,
    failedCount,
    successRate,
    revenueGrowth,
    paymentMethods
  };

  return <PaymentsClient data={paymentsData} />;
}
