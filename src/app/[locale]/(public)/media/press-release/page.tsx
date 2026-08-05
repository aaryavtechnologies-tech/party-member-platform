import { prisma } from "@/lib/prisma";
import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { NewsCard } from "@/components/news/NewsCard";
import { NewsFilters } from "@/components/news/NewsFilters";
import { Prisma } from "@prisma/client";
import { getTranslations } from "next-intl/server";

export default async function PublicPressReleasePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const search = await searchParams;
  const tNav = await getTranslations("Navigation");

  const searchQuery = typeof search.search === "string" ? search.search : undefined;
  const categoryFilter = typeof search.category === "string" ? search.category : undefined;
  const stateFilter = typeof search.state === "string" ? search.state : undefined;
  const districtFilter = typeof search.district === "string" ? search.district : undefined;
  
  // Construct the base where clause
  const whereClause: Prisma.NewsArticleWhereInput = {
    status: "PUBLISHED",
    isPressRelease: true,
  };

  // 1. Search Query (Title or Content in Translations)
  if (searchQuery) {
    whereClause.translations = {
      some: {
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { content: { contains: searchQuery, mode: "insensitive" } },
        ]
      }
    };
  }

  // 2. Category Filter
  if (categoryFilter) {
    whereClause.categories = {
      some: {
        name: { equals: categoryFilter, mode: "insensitive" }
      }
    };
  }

  // 3. Location Filters
  if (stateFilter) {
    whereClause.state = { equals: stateFilter, mode: "insensitive" };
  }
  if (districtFilter) {
    whereClause.district = { equals: districtFilter, mode: "insensitive" };
  }

  const hasActiveFilters = !!(searchQuery || categoryFilter || stateFilter || districtFilter);

  // Fetch main list of press releases
  const articles = await prisma.newsArticle.findMany({
    where: whereClause,
    orderBy: { publishedAt: "desc" },
    include: {
      translations: true,
      categories: true,
    }
  });

  return (
    <main className="bg-slate-50 dark:bg-slate-900/50 min-h-screen">
      <InnerPageHeader 
        title="Press Releases"
        description="All official statements, announcements, and media communications of the Rashtriya Annadata Vikas Party."
        breadcrumbs={[{ label: tNav("media"), href: "/media" }, { label: "Press Releases", href: "/media/press-release" }]}
      />

      <div className="py-12 container mx-auto px-4 max-w-7xl">
        
        {/* Filters Component (Reusing News Filters) */}
        <NewsFilters />

        {/* Main Grid */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
            {hasActiveFilters ? "Search Results" : "Latest Press Releases"}
          </h2>

          {articles.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">No Press Releases Found</h2>
              <p className="text-slate-500 mt-2">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => {
                const translation = 
                  article.translations.find((t: any) => t.language === locale) || 
                  article.translations.find((t: any) => t.language === 'en') ||
                  article.translations[0];

                return (
                  <NewsCard 
                    key={article.id} 
                    article={article} 
                    translation={translation} 
                    locale={locale} 
                    basePath="/media/press-release"
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
