import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { Metadata } from "next";

// Define the params interface for the Dynamic Route
interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

// Dynamically generate SEO metadata based on the CMS data
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  
  const page = await prisma.cmsPage.findFirst({
    where: { 
      slug: slug,
      status: "PUBLISHED",
      // If language strictness is required: language: locale 
    }
  });

  if (!page) {
    return { title: "Page Not Found - RAVP" };
  }

  return {
    title: page.seoTitle || `${page.title} - RAVP`,
    description: page.seoDescription,
    keywords: page.seoKeywords,
  };
}

export default async function CMSPublicPage({ params }: PageProps) {
  const { slug, locale } = await params;

  // Fetch the page from the database
  const page = await prisma.cmsPage.findFirst({
    where: {
      slug: slug,
      status: "PUBLISHED"
    }
  });

  // If page doesn't exist, Next.js throws a 404 naturally
  if (!page) {
    notFound();
  }

  return (
    <main>
      <InnerPageHeader 
        title={page.title}
        description={page.seoDescription || ""}
        breadcrumbs={[{ label: page.title, href: `/p/${slug}` }]}
      />
      
      {/* Rich Text Content Container */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="prose prose-lg dark:prose-invert prose-orange max-w-none 
                       prose-headings:font-bold prose-headings:text-slate-900 
                       prose-a:text-orange-600 hover:prose-a:text-orange-700
                       prose-img:rounded-xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
    </main>
  );
}
