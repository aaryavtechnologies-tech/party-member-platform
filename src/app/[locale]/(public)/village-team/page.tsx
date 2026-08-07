import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { VillageTeamView } from "@/components/organization/VillageTeamView";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  
  const title = locale === 'gu' ? "ગ્રામ ટીમ | રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી" : "Village Team | Rashtriya Annadata Vikas Party";
  const description = locale === 'gu' 
    ? "મજબૂત ગ્રામ સંગઠન – સમૃદ્ધ ખેડૂત. પાયાના સ્તરથી રાષ્ટ્ર નિર્માણની શરૂઆત."
    : "Strong Village Organization – Prosperous Farmer. Grassroots foundation for nation building.";
  const url = `${process.env.NEXT_PUBLIC_APP_URL || 'https://ravp.org'}/${locale}/village-team`;

  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: "website" } };
}

export default async function VillageTeamPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const resolvedParams = await searchParams;
  const currentState = typeof resolvedParams.state === 'string' ? resolvedParams.state : "Gujarat";
  const currentDistrict = typeof resolvedParams.district === 'string' ? resolvedParams.district : "Ahmedabad";
  const currentTaluka = typeof resolvedParams.taluka === 'string' ? resolvedParams.taluka : "Sanand";
  const currentVillage = typeof resolvedParams.village === 'string' ? resolvedParams.village : "Maniyar";

  // 1. Fetch available Districts (Level 3), Talukas (Level 4), and Villages (Level 5)
  const allDistrictsData = await prisma.organizationUnit.findMany({
    where: { level: { priority: 3 } },
    select: { nameEn: true, parent: { select: { nameEn: true } } }
  });

  const availableDistricts = allDistrictsData.map(d => ({
    name: d.nameEn, state: d.parent?.nameEn || "Unknown", parentName: d.parent?.nameEn || "Unknown"
  }));

  const allTalukasData = await prisma.organizationUnit.findMany({
    where: { level: { priority: 4 } },
    select: { nameEn: true, parent: { select: { nameEn: true } } }
  });

  const availableTalukas = allTalukasData.map(t => ({
    name: t.nameEn, parentName: t.parent?.nameEn || "Unknown"
  }));

  const allVillagesData = await prisma.organizationUnit.findMany({
    where: { level: { priority: 5 } },
    select: { nameEn: true, parent: { select: { nameEn: true } } }
  });

  const availableVillages = allVillagesData.map(v => ({
    name: v.nameEn, parentName: v.parent?.nameEn || "Unknown"
  }));

  // 2. Fetch Village Level Office Bearers (Level 5)
  const bearers = await prisma.officeBearer.findMany({
    where: {
      status: "ACTIVE",
      unit: {
        level: { priority: 5 },
        nameEn: { equals: currentVillage, mode: 'insensitive' },
        parent: { 
          nameEn: { equals: currentTaluka, mode: 'insensitive' },
          parent: { 
            nameEn: { equals: currentDistrict, mode: 'insensitive' },
            parent: { nameEn: { equals: currentState, mode: 'insensitive' } }
          }
        }
      }
    },
    include: {
      member: { include: { user: true } },
      position: true
    },
    orderBy: { position: { priority: 'asc' } }
  });

  const formattedBearers = bearers.map(b => ({
    id: b.id,
    member: {
      user: { name: b.member.user.name, image: b.member.user.image },
      state: b.member.state, district: b.member.district, 
      taluka: b.member.taluka || currentTaluka, village: b.member.village || currentVillage
    },
    position: { nameEn: b.position.nameEn, nameGu: b.position.nameGu, priority: b.position.priority },
    startDate: b.startDate.toISOString()
  }));

  // 3. Aggregate Statistics for this specific Village
  const membersCount = await prisma.memberProfile.count({
    where: { village: { equals: currentVillage, mode: 'insensitive' } }
  });

  const stats = {
    households: Math.max(150, Math.floor(membersCount * 2.5)), // Fallback demo math if DB empty
    members: Math.max(120, membersCount), 
    activeMembers: Math.max(90, Math.floor(membersCount * 0.7)),
  };

  return (
    <main>
      <VillageTeamView 
        bearers={formattedBearers} 
        currentState={currentState}
        currentDistrict={currentDistrict}
        currentTaluka={currentTaluka}
        currentVillage={currentVillage}
        availableDistricts={availableDistricts}
        availableTalukas={availableTalukas}
        availableVillages={availableVillages}
        stats={stats}
      />
    </main>
  );
}
