import { prisma } from "@/lib/prisma";

export async function getPublicStats() {
  return prisma.statItem.findMany({
    orderBy: { order: 'asc' }
  });
}

export async function getPublicCoreValues() {
  return prisma.coreValue.findMany({
    orderBy: { order: 'asc' }
  });
}

export async function getPublicPolicies(locale: string = 'en') {
  return prisma.policy.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      translations: {
        where: { language: locale }
      }
    },
    orderBy: { order: 'asc' }
  });
}

export async function getPublicFAQs(locale: string = 'en') {
  return prisma.faqItem.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      translations: {
        where: { language: locale }
      }
    },
    orderBy: { order: 'asc' }
  });
}
