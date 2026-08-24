import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FaqClientWrapper } from "@/components/faq/FaqClientWrapper";
import { FaqSeoSchema } from "@/components/faq/FaqSeoSchema";
import { FaqItemType } from "@/components/faq/FaqAccordion";

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

// Map database categories to UI-friendly objects
const STANDARD_CATEGORIES = [
  { id: "cat-general", slug: "GENERAL", nameEn: "General", nameGu: "સામાન્ય" },
  { id: "cat-membership", slug: "MEMBERSHIP", nameEn: "Membership", nameGu: "સભ્યપદ" },
  { id: "cat-payments", slug: "PAYMENTS", nameEn: "Payments", nameGu: "ચુકવણીઓ" },
  { id: "cat-dashboard", slug: "DASHBOARD", nameEn: "Dashboard", nameGu: "ડેશબોર્ડ" },
  { id: "cat-organization", slug: "ORGANIZATION", nameEn: "Organization", nameGu: "સંગઠન" },
  { id: "cat-contact", slug: "CONTACT", nameEn: "Contact", nameGu: "સંપર્ક" },
  { id: "cat-security", slug: "SECURITY", nameEn: "Security", nameGu: "સુરક્ષા" },
  { id: "cat-technical", slug: "TECHNICAL", nameEn: "Technical", nameGu: "ટેકનિકલ" },
];

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let categories = STANDARD_CATEGORIES;
  let faqs: FaqItemType[] = [];

  try {
    const faqsRaw = await prisma.faqItem.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: {
        translations: true,
      },
    });

    faqs = faqsRaw.map((raw) => {
      const en = raw.translations.find((t) => t.language === "en");
      const gu = raw.translations.find((t) => t.language === "gu");
      const categoryMapping = STANDARD_CATEGORIES.find((c) => c.slug === raw.category) || STANDARD_CATEGORIES[0];

      return {
        id: raw.id,
        questionEn: en?.question || "",
        answerEn: en?.answer || "",
        questionGu: gu?.question || en?.question || "",
        answerGu: gu?.answer || en?.answer || "",
        featured: raw.order < 5, // Visual proxy for featured since it isn't on the model
        category: {
          slug: categoryMapping.slug,
          nameEn: categoryMapping.nameEn,
          nameGu: categoryMapping.nameGu,
        },
      };
    });
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
