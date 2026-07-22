import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FaqClientWrapper } from "@/components/faq/FaqClientWrapper";
import { FaqSeoSchema } from "@/components/faq/FaqSeoSchema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isGu = locale === "gu";

  const title = isGu
    ? "વારંવાર પૂછાતા પ્રશ્નો (FAQ) - રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી (RAVP)"
    : "Frequently Asked Questions (FAQ) - Rashtriya Annadata Vikas Party (RAVP)";

  const description = isGu
    ? "RAVP વિશે વારંવાર પૂછાતા ૨૦ મુખ્ય પ્રશ્નોના જવાબો. સભ્યપદ, આઈડી કાર્ડ, ઓનલાઇન પેમેન્ટ, ડેશબોર્ડ અને સંગઠન માહિતી."
    : "Find clear answers to questions regarding RAVP membership, digital ID cards, payments, dashboard portal, and organization.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: isGu ? "gu_IN" : "en_US",
      url: `https://www.rashtriyaannadatavikasparty.org/${locale}/faq`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let categories: any[] = [];
  let faqs: any[] = [];

  try {
    const [catsRaw, faqsRaw] = await Promise.all([
      prisma.faqCategory.findMany({
        where: { status: "ACTIVE" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.faq.findMany({
        where: { published: true, deletedAt: null },
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
        include: {
          category: {
            select: { nameEn: true, nameGu: true, slug: true },
          },
        },
      }),
    ]);

    categories = catsRaw;
    faqs = faqsRaw;
  } catch (err) {
    console.error("Error fetching FAQ page SSR data:", err);
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Structured Data JSON-LD */}
      <FaqSeoSchema locale={locale} faqs={faqs} />

      {/* Interactive Public Client Wrapper */}
      <FaqClientWrapper
        locale={locale}
        initialCategories={categories}
        initialFaqs={faqs}
      />
    </main>
  );
}
