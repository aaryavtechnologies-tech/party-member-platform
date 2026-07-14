import type { Metadata } from "next";
import { Poppins, Hind_Vadodara } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import Script from "next/script";
import "../globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const hindVadodara = Hind_Vadodara({
  variable: "--font-hind-vadodara",
  subsets: ["gujarati", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Index" });

  return {
    title: {
      template: '%s | Political Organization',
      default: t("title"),
    },
    description: "The official digital portal of our National Political Organization. Join us in building a better future through transparency, unity, and development.",
    openGraph: {
      title: t("title"),
      description: "The official digital portal of our National Political Organization.",
      url: "https://example.com",
      siteName: "Political Organization",
      images: [
        {
          url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&h=630&fit=crop",
          width: 1200,
          height: 630,
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: "The official digital portal of our National Political Organization.",
      images: ["https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&h=630&fit=crop"],
    },
    alternates: {
      canonical: "https://example.com",
      languages: {
        en: "https://example.com/en",
        gu: "https://example.com/gu",
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${poppins.variable} ${hindVadodara.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className={`min-h-full flex flex-col ${
          locale === "gu" ? "font-hind" : "font-poppins"
        }`}
      >
        <SmoothScrollProvider>
          <NextIntlClientProvider messages={messages}>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </NextIntlClientProvider>
        </SmoothScrollProvider>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Political Organization",
              "url": "https://example.com",
              "logo": "https://example.com/logo.png",
              "sameAs": [
                "https://facebook.com/organization",
                "https://twitter.com/organization",
                "https://instagram.com/organization"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
