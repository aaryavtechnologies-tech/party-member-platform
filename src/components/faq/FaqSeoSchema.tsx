import React from "react";

interface FaqSeoSchemaProps {
  locale: string;
  faqs: Array<{
    questionGu: string;
    questionEn: string;
    answerGu: string;
    answerEn: string;
  }>;
}

export function FaqSeoSchema({ locale, faqs }: FaqSeoSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.RENDER_EXTERNAL_URL || "https://party-member-platform.onrender.com";
  const isGu = locale === "gu";

  const faqItemsSchema = faqs.map((faq) => ({
    "@type": "Question",
    "name": isGu ? faq.questionGu : faq.questionEn,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": isGu ? faq.answerGu : faq.answerEn,
    },
  }));

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItemsSchema,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": isGu ? "મુખ્ય પૃષ્ઠ" : "Home",
        "item": `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": isGu ? "વારંવાર પૂછાતા પ્રશ્નો (FAQ)" : "FAQ",
        "item": `${baseUrl}/${locale}/faq`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
