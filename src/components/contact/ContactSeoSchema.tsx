import React from "react";

interface ContactSeoSchemaProps {
  locale: string;
}

export function ContactSeoSchema({ locale }: ContactSeoSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.RENDER_EXTERNAL_URL || "https://party-member-platform.onrender.com";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "PoliticalParty",
    "name": "Rashtriya Annadata Vikas Party (RAVP)",
    "alternateName": "રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "336 Royal Complex, Bhutkhana Chowk, Dhebar Road",
      "addressLocality": "Rajkot",
      "addressRegion": "Gujarat",
      "postalCode": "360001",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9016641851",
      "contactType": "customer service",
      "email": "info@rashtriyaannadatavikasparty.org",
      "availableLanguage": ["en", "gu"]
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": locale === "gu" ? "મુખ્ય પૃષ્ઠ" : "Home",
        "item": `${baseUrl}/${locale}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": locale === "gu" ? "અમારો સંપર્ક કરો" : "Contact Us",
        "item": `${baseUrl}/${locale}/contact`
      }
    ]
  };

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": locale === "gu" ? "અમારો સંપર્ક કરો - રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી" : "Contact Us - Rashtriya Annadata Vikas Party",
    "description": locale === "gu"
      ? "RAVP કાર્યાલય સરનામું, હેલ્પલાઇન નંબર 9016641851, ઇમેઇલ અને ઑનલાઇન સંપર્ક ફોર્મ."
      : "Contact RAVP Headquarters in Rajkot, Gujarat. Phone 9016641851, email info@rashtriyaannadatavikasparty.org.",
    "url": `${baseUrl}/${locale}/contact`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
    </>
  );
}
