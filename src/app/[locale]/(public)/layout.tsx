import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { prisma } from "@/lib/prisma";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let office = null;
  let socialLinks: any[] = [];

  try {
    const [officeRaw, socialRaw] = await Promise.all([
      prisma.contactOffice.findFirst({
        where: { isHeadquarters: true },
      }),
      prisma.contactSocialLink.findMany({
        where: { isEnabled: true },
        orderBy: { order: "asc" },
      })
    ]);
    office = officeRaw;
    socialLinks = socialRaw;
  } catch (err) {
    console.error("Error fetching global contact info:", err);
  }

  return (
    <SmoothScrollProvider>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer office={office} socialLinks={socialLinks} />
    </SmoothScrollProvider>
  );
}
