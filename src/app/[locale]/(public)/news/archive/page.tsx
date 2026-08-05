import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { NewsCard } from "@/components/news/NewsCard";
import { Archive as ArchiveIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "News Archive - RAVP",
  description: "Browse the historical archives of all news articles published by the Rashtriya Annadata Vikas Party, organized by year.",
};

export default async function NewsArchivePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("News");

  // Fetch all published news articles (not press releases)
  const articles = await prisma.newsArticle.findMany({
    where: { 
      status: "PUBLISHED",
      isPressRelease: false
    },
    orderBy: { publishedAt: "desc" },
    include: {
      translations: true,
      categories: true,
      media: {
        include: { media: true }
      }
    }
  });

  // Group by Year
  const archivedByYear = articles.reduce((acc, article) => {
    const year = article.publishedAt 
      ? new Date(article.publishedAt).getFullYear() 
      : new Date(article.createdAt).getFullYear();
      
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(article);
    return acc;
  }, {} as Record<number, typeof articles>);

  const years = Object.keys(archivedByYear).map(Number).sort((a, b) => b - a);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
            <ArchiveIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
            News Archive
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Browse our historical records of news, announcements, and events organized by year.
          </p>
        </div>

        {/* Archives */}
        {years.length > 0 ? (
          <div className="space-y-24">
            {years.map(year => (
              <div key={year}>
                <div className="flex items-center gap-6 mb-10">
                  <h2 className="text-4xl font-black text-slate-800 dark:text-slate-200">{year}</h2>
                  <div className="flex-grow h-px bg-slate-200 dark:bg-slate-800"></div>
                  <span className="text-sm font-semibold text-slate-500 bg-slate-200 dark:bg-slate-800 px-4 py-1 rounded-full">
                    {archivedByYear[year].length} Articles
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {archivedByYear[year].map(article => {
                    const translation = 
                      article.translations.find(t => t.language === locale) || 
                      article.translations.find(t => t.language === 'en') ||
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Archives Available</h3>
            <p className="text-slate-500">There are currently no news articles available in the archive.</p>
          </div>
        )}

      </div>
    </main>
  );
}
