import { prisma } from "@/lib/prisma";
import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { NewsCard } from "@/components/news/NewsCard";
import { NewsFilters } from "@/components/news/NewsFilters";
import { FeaturedNewsCarousel } from "@/components/news/FeaturedNewsCarousel";
import { Prisma } from "@prisma/client";

export default async function PublicNewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const search = await searchParams;

  const searchQuery = typeof search.search === "string" ? search.search : undefined;
  const categoryFilter = typeof search.category === "string" ? search.category : undefined;
  const stateFilter = typeof search.state === "string" ? search.state : undefined;
  const districtFilter = typeof search.district === "string" ? search.district : undefined;
  
  // Construct the base where clause
  const whereClause: Prisma.NewsArticleWhereInput = {
    status: "PUBLISHED",
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

  // Check if any filters are active to decide whether to show Featured News
  const hasActiveFilters = !!(searchQuery || categoryFilter || stateFilter || districtFilter);

  // Fetch Featured News ONLY if no filters are active
  let featuredArticles: any[] = [];
  if (!hasActiveFilters) {
    featuredArticles = await prisma.newsArticle.findMany({
      where: { status: "PUBLISHED", isFeatured: true },
      orderBy: { publishedAt: "desc" },
      take: 2,
      include: {
        translations: true,
        categories: true,
      }
    });
  }

  // Fetch main list of articles (excluding featured if we are showing them)
  const articles = await prisma.newsArticle.findMany({
    where: {
      ...whereClause,
      // If we are showing featured articles at the top, don't show them again in the grid
      ...( (!hasActiveFilters && featuredArticles.length > 0) 
            ? { id: { notIn: featuredArticles.map(f => f.id) } } 
            : {} )
    },
    orderBy: { publishedAt: "desc" },
    include: {
      translations: true,
      categories: true,
    }
  });

  return (
    <main className="bg-slate-50 dark:bg-slate-900/50 min-h-screen">
      <InnerPageHeader 
        title="News & Updates"
        description="Stay informed with the latest announcements, press releases, and developments from our party."
        breadcrumbs={[{ label: "News", href: "/news" }]}
      />

      <div className="py-12 container mx-auto px-4 max-w-7xl">
        
        {/* Filters Component */}
        <NewsFilters />

        {/* Featured News (Only on default view) */}
        {!hasActiveFilters && <FeaturedNewsCarousel featuredArticles={featuredArticles} locale={locale} />}

        {/* Main Grid */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-1 bg-primary rounded-full"></span>
            {hasActiveFilters ? "Search Results" : "Latest News"}
          </h2>

          {articles.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">No News Articles Found</h2>
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
