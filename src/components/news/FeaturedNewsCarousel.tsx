import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface FeaturedNewsCarouselProps {
  featuredArticles: any[];
  locale: string;
}

export function FeaturedNewsCarousel({ featuredArticles, locale }: FeaturedNewsCarouselProps) {
  if (!featuredArticles || featuredArticles.length === 0) return null;

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
        <span className="w-8 h-1 bg-primary rounded-full"></span>
        Featured News
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {featuredArticles.slice(0, 2).map((article) => {
          const translation = 
            article.translations.find((t: any) => t.language === locale) || 
            article.translations.find((t: any) => t.language === 'en') ||
            article.translations[0];

          if (!translation) return null;

          return (
            <Link 
              key={article.id} 
              href={`/news/${translation.slug}`}
              className="group relative rounded-3xl overflow-hidden aspect-[16/9] lg:aspect-[4/3] block shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              {/* Background / Image Placeholder */}
              <div className="absolute inset-0 bg-slate-800">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/60 to-transparent z-10" />
                {/* Image would go here */}
              </div>

              {article.isPressRelease && (
                <div className="absolute top-6 left-6 bg-accent text-slate-950 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-20 shadow-lg">
                  Press Release
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-20 flex flex-col justify-end">
                <div className="flex gap-2 mb-3">
                  {article.categories && article.categories[0] && (
                    <span className="bg-primary/90 text-white text-xs font-bold px-2 py-1 rounded">
                      {article.categories[0].name}
                    </span>
                  )}
                  {(article.state || article.district) && (
                    <span className="bg-green-600/90 text-white text-xs font-bold px-2 py-1 rounded">
                      {article.district || article.state}
                    </span>
                  )}
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-3">
                  {translation.title}
                </h3>
                
                <div className="flex items-center text-primary font-bold text-sm uppercase tracking-wider group-hover:text-accent transition-colors">
                  Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
