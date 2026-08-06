"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

// --- STATS ---
export async function getAdminStats() {
  await requireAdminAuth();
  return prisma.statItem.findMany({ orderBy: { order: "asc" } });
}

export async function createAdminStat(data: { labelKey: string; value: number; icon: string; order?: number }) {
  await requireAdminAuth();
  const stat = await prisma.statItem.create({ data });
  revalidatePath("/");
  return stat;
}

export async function deleteAdminStat(id: string) {
  await requireAdminAuth();
  await prisma.statItem.delete({ where: { id } });
  revalidatePath("/");
}

// --- CORE VALUES ---
export async function getAdminCoreValues() {
  await requireAdminAuth();
  return prisma.coreValue.findMany({ orderBy: { order: "asc" } });
}

export async function createAdminCoreValue(data: { titleKey: string; icon: string; order?: number }) {
  await requireAdminAuth();
  const val = await prisma.coreValue.create({ data });
  revalidatePath("/");
  return val;
}

export async function deleteAdminCoreValue(id: string) {
  await requireAdminAuth();
  await prisma.coreValue.delete({ where: { id } });
  revalidatePath("/");
}

// --- POLICIES ---
export async function getAdminPolicies() {
  await requireAdminAuth();
  return prisma.policy.findMany({ 
    include: { translations: true },
    orderBy: { order: "asc" } 
  });
}

export async function createAdminPolicy(data: { titleEn: string; descEn: string; titleGu: string; descGu: string }) {
  await requireAdminAuth();
  const policy = await prisma.policy.create({
    data: {
      translations: {
        create: [
          { language: 'en', title: data.titleEn, content: data.descEn, slug: `en-${Date.now()}` },
          { language: 'gu', title: data.titleGu, content: data.descGu, slug: `gu-${Date.now()}` },
        ]
      }
    }
  });
  revalidatePath("/");
  return policy;
}

export async function deleteAdminPolicy(id: string) {
  await requireAdminAuth();
  await prisma.policy.delete({ where: { id } });
  revalidatePath("/");
}

// --- FAQS ---
export async function getAdminFAQs() {
  await requireAdminAuth();
  return prisma.faqItem.findMany({ 
    include: { translations: true },
    orderBy: { order: "asc" } 
  });
}

export async function createAdminFAQ(data: { qEn: string; aEn: string; qGu: string; aGu: string }) {
  await requireAdminAuth();
  const faq = await prisma.faqItem.create({
    data: {
      translations: {
        create: [
          { language: 'en', question: data.qEn, answer: data.aEn },
          { language: 'gu', question: data.qGu, answer: data.aGu },
        ]
      }
    }
  });
  revalidatePath("/");
  return faq;
}

export async function deleteAdminFAQ(id: string) {
  await requireAdminAuth();
  await prisma.faqItem.delete({ where: { id } });
  revalidatePath("/");
}
