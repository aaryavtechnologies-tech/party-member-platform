import { prisma } from "@/lib/prisma";
import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { Link } from "@/i18n/routing";
import { ArrowRight, Calendar, Tag } from "lucide-react";

export default async function PublicNewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Fetch only PUBLISHED articles
  const articles = await prisma.newsArticle.findMany({
    where: { status: "PUBLISHED" },
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

      <div className="py-20 container mx-auto px-4 max-w-7xl">
        {articles.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">No News Articles Found</h2>
            <p className="text-slate-500 mt-2">Check back later for updates and press releases.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => {
              // Try to find the translation matching the current locale, fallback to english or the first available
              const translation = 
                article.translations.find(t => t.language === locale) || 
                article.translations.find(t => t.language === 'en') ||
                article.translations[0];

              if (!translation) return null;

              return (
                <Link 
                  key={article.id} 
                  href={`/news/${translation.slug}`}
                  className="group bg-white dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col"
                >
                  <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                    {/* Placeholder for Featured Image */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 mix-blend-multiply" />
                    
                    {article.isPressRelease && (
                      <div className="absolute top-4 left-4 bg-accent text-slate-950 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10 shadow-lg">
                        Press Release
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-4 uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary" />
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : new Date(article.createdAt).toLocaleDateString()}
                      </div>
                      {article.categories[0] && (
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-4 h-4 text-accent" />
                          {article.categories[0].name}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {translation.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 text-sm leading-relaxed flex-1">
                      {translation.summary || translation.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..."}
                    </p>
                    
                    <div className="flex items-center text-primary font-bold text-sm uppercase tracking-wider group-hover:text-accent transition-colors">
                      Read Full Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
