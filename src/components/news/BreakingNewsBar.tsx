import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { AlertCircle } from "lucide-react";

export async function BreakingNewsBar({ locale }: { locale: string }) {
  const breakingNews = await prisma.newsArticle.findMany({
    where: { 
      status: "PUBLISHED",
      isBreaking: true
    },
    orderBy: { publishedAt: "desc" },
    take: 5,
    include: {
      translations: true,
    }
  });

  if (breakingNews.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-600 text-white w-full overflow-hidden relative z-40 border-b border-red-700 shadow-md">
      <div className="flex items-center w-full">
        <div className="bg-red-700 font-bold px-4 md:px-6 py-2.5 z-10 shrink-0 shadow-[4px_0_12px_rgba(0,0,0,0.2)] flex items-center gap-2 tracking-wide uppercase text-sm md:text-base">
          <AlertCircle className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
          <span>Breaking News</span>
        </div>
        
        {/* CSS Marquee */}
        <div className="flex-1 overflow-hidden relative whitespace-nowrap py-2.5">
          <div className="animate-marquee inline-block hover:[animation-play-state:paused]">
            {breakingNews.map((article, index) => {
              const translation = 
                article.translations.find(t => t.language === locale) || 
                article.translations.find(t => t.language === 'en') ||
                article.translations[0];

              if (!translation) return null;

              return (
                <span key={article.id} className="inline-flex items-center px-8">
                  <Link href={`/news/${translation.slug}`} className="hover:underline font-medium text-sm md:text-base">
                    {translation.title}
                  </Link>
                  {index < breakingNews.length - 1 && (
                    <span className="mx-8 opacity-50">•</span>
                  )}
                </span>
              );
            })}
            
            {/* Duplicate for seamless looping if content is small */}
            {breakingNews.length > 0 && breakingNews.map((article, index) => {
              const translation = 
                article.translations.find(t => t.language === locale) || 
                article.translations.find(t => t.language === 'en') ||
                article.translations[0];

              if (!translation) return null;

              return (
                <span key={`dup-${article.id}`} className="inline-flex items-center px-8 ml-8">
                  <Link href={`/news/${translation.slug}`} className="hover:underline font-medium text-sm md:text-base">
                    {translation.title}
                  </Link>
                  {index < breakingNews.length - 1 && (
                    <span className="mx-8 opacity-50">•</span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
