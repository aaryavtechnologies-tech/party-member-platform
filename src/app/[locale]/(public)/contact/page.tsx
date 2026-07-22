import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactIntro } from "@/components/contact/ContactIntro";
import { ContactJoinCta } from "@/components/contact/ContactJoinCta";
import { ContactServices } from "@/components/contact/ContactServices";
import { ContactHeadquarters } from "@/components/contact/ContactHeadquarters";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactMap } from "@/components/contact/ContactMap";
import { ContactSocial } from "@/components/contact/ContactSocial";
import { ContactFaqSection } from "@/components/contact/ContactFaqSection";
import { ContactCommitment } from "@/components/contact/ContactCommitment";
import { ContactMotto } from "@/components/contact/ContactMotto";
import { ContactSeoSchema } from "@/components/contact/ContactSeoSchema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isGu = locale === "gu";

  const title = isGu
    ? "અમારો સંપર્ક કરો - રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી (RAVP)"
    : "Contact Us - Rashtriya Annadata Vikas Party (RAVP)";

  const description = isGu
    ? "RAVP મુખ્ય કાર્યાલય ૩૩૬ રોયલ કોમ્પ્લેક્સ, ભૂતખાના ચોક, ઢેબર રોડ, રાજકોટ. હેલ્પલાઇન 9016641851, ઇમેઇલ info@rashtriyaannadatavikasparty.org."
    : "Get in touch with Rashtriya Annadata Vikas Party (RAVP) Headquarters at Rajkot, Gujarat. Call 9016641851 or email info@rashtriyaannadatavikasparty.org.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: isGu ? "gu_IN" : "en_US",
      url: `https://www.rashtriyaannadatavikasparty.org/${locale}/contact`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let office = null;
  let socialLinks: any[] = [];
  let faqs: any[] = [];
  let settings: Record<string, any> = {};

  try {
    const [officeRaw, socialRaw, faqsRaw, settingsRaw] = await Promise.all([
      prisma.contactOffice.findFirst({
        where: { isHeadquarters: true },
        include: { workingHours: { orderBy: { order: "asc" } } },
      }),
      prisma.contactSocialLink.findMany({
        where: { isEnabled: true },
        orderBy: { order: "asc" },
      }),
      prisma.contactFaq.findMany({
        where: { isEnabled: true },
        orderBy: { order: "asc" },
      }),
      prisma.contactSetting.findMany(),
    ]);

    office = officeRaw;
    socialLinks = socialRaw;
    faqs = faqsRaw;

    settingsRaw.forEach((item) => {
      try {
        settings[item.key] = JSON.parse(item.value);
      } catch {
        settings[item.key] = item.value;
      }
    });
  } catch (err) {
    console.error("Error fetching contact page SSR data:", err);
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Structured Data SEO JSON-LD */}
      <ContactSeoSchema locale={locale} />

      {/* Hero Section */}
      <ContactHero locale={locale} data={settings.contact_hero} />

      {/* Section 1 — Introduction */}
      <ContactIntro locale={locale} data={settings.contact_intro} />

      {/* Section 2 — Join RAVP CTA */}
      <ContactJoinCta locale={locale} />

      {/* Section 3 — Contact Services (10 Cards) */}
      <ContactServices locale={locale} />

      {/* Section 4 & 5 — Headquarters Information & Working Hours */}
      <ContactHeadquarters
        locale={locale}
        data={{
          officeNameEn: office?.officeNameEn || undefined,
          officeNameGu: office?.officeNameGu || undefined,
          addressEn: office?.addressEn || undefined,
          addressGu: office?.addressGu || undefined,
          phone: office?.phone || undefined,
          email: office?.email || undefined,
          website: office?.website || undefined,
          googleMapUrl: office?.googleMapUrl || undefined,
          workingHours: office?.workingHours || undefined,
        }}
      />

      {/* Section 6 — Online Contact Form */}
      <ContactForm locale={locale} />

      {/* Section 7 — Google Map Embed */}
      <ContactMap
        locale={locale}
        embedUrl={office?.embedMapUrl || undefined}
        mapUrl={office?.googleMapUrl || undefined}
      />

      {/* Section 8 — Social Media Links */}
      <ContactSocial locale={locale} socialLinks={socialLinks} />

      {/* Section 9 — Frequently Asked Questions */}
      <ContactFaqSection locale={locale} faqs={faqs} />

      {/* Section 10 — Our Commitment */}
      <ContactCommitment locale={locale} data={settings.contact_commitment} />

      {/* Section 11 — Our Motto Banner */}
      <ContactMotto locale={locale} data={settings.contact_motto} />
    </main>
  );
}
