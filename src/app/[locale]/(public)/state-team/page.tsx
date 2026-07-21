import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { StateTeamView } from "@/components/organization/StateTeamView";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  
  const title = locale === 'gu' ? "રાજ્ય ટીમ | રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી" : "State Team | Rashtriya Annadata Vikas Party";
  const description = locale === 'gu' 
    ? "રાજ્યના દરેક જિલ્લામાં સંગઠનને મજબૂત બનાવતી જવાબદાર, પારદર્શક અને જનસેવાને સમર્પિત રાજ્ય ટીમ."
    : "Leading the party across every district through responsible leadership, transparent governance, and effective coordination.";
  const url = `${process.env.NEXT_PUBLIC_APP_URL || 'https://ravp.org'}/${locale}/state-team`;

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

export default async function StateTeamPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const resolvedParams = await searchParams;
  const currentState = typeof resolvedParams.state === 'string' ? resolvedParams.state : "Gujarat";

  // Fetch State Level Office Bearers for the specific state
  // Priority 2 is assumed to be State Level based on our schema setup
  const bearers = await prisma.officeBearer.findMany({
    where: {
      status: "ACTIVE",
      unit: {
        level: {
          priority: 2
        },
        nameEn: {
          contains: currentState,
          mode: 'insensitive'
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
  
  return (
    <main>
      <StateTeamView bearers={formattedBearers} currentState={currentState} />
    </main>
  );
}
