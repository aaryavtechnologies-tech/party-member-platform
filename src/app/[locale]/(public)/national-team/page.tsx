import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { NationalTeamView } from "@/components/organization/NationalTeamView";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  
  const title = locale === 'gu' ? "રાષ્ટ્રીય ટીમ | રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી" : "National Team | Rashtriya Annadata Vikas Party";
  const description = locale === 'gu' 
    ? "મજબૂત રાષ્ટ્રીય નેતૃત્વ, મજબૂત સંગઠન અને સમૃદ્ધ ભારત માટે રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટીની રાષ્ટ્રીય ટીમ."
    : "The National Team of Rashtriya Annadata Vikas Party for strong national leadership, strong organization, and a prosperous India.";
  const url = `${process.env.NEXT_PUBLIC_APP_URL || 'https://ravp.org'}/${locale}/national-team`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    }
  };
}

export default async function NationalTeamPage() {
  
  // Fetch National Level Office Bearers
  // Priority 1 is assumed to be National Level based on our schema setup
  const bearers = await prisma.officeBearer.findMany({
    where: {
      status: "ACTIVE",
      unit: {
        level: {
          priority: 1
        }
      }
    },
    include: {
      member: {
        include: {
          user: true
        }
      },
      position: true
    },
    orderBy: {
      position: {
        priority: 'asc'
      }
    }
  });

  // Formatting data to match component interface and ensure serialization
  const formattedBearers = bearers.map(b => ({
    id: b.id,
    member: {
      user: {
        name: b.member.user.name,
        image: b.member.user.image,
      },
      state: b.member.state,
      district: b.member.district,
    },
    position: {
      nameEn: b.position.nameEn,
      nameGu: b.position.nameGu,
      priority: b.position.priority,
    }
  }));

  // To integrate CMS data in the future:
  // const cmsData = await prisma.cmsPage.findFirst(...)
  
  return (
    <main>
      <NationalTeamView bearers={formattedBearers} />
    </main>
  );
}
