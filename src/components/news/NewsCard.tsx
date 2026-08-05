import { Link } from "@/i18n/routing";
import { ArrowRight, Calendar, Tag, MapPin } from "lucide-react";
import Image from "next/image";

interface NewsCardProps {
  article: any;
  translation: any;
  locale: string;
  basePath?: string;
}

export function NewsCard({ article, translation, locale, basePath = "/news" }: NewsCardProps) {
  if (!translation) return null;

  return (
    <Link 
      href={`${basePath}/${translation.slug}`}
      className="group bg-white dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col h-full"
    >
      <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
        {/* Placeholder for Featured Image if media doesn't exist */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 mix-blend-multiply z-0" />
        
        {/* TODO: Add next/image when media exists */}
        
        {article.isPressRelease && (
          <div className="absolute top-4 left-4 bg-accent text-slate-950 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10 shadow-lg">
            Press Release
          </div>
        )}
      </div>
      
      <div className="p-6 sm:p-8 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mb-4 uppercase tracking-wider">
          <div className="flex items-center gap-1.5 shrink-0">
            <Calendar className="w-4 h-4 text-primary" />
            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : new Date(article.createdAt).toLocaleDateString()}
          </div>
          {article.categories && article.categories[0] && (
            <div className="flex items-center gap-1.5 shrink-0">
              <Tag className="w-4 h-4 text-accent" />
              {article.categories[0].name}
            </div>
          )}
          {(article.state || article.district) && (
            <div className="flex items-center gap-1.5 shrink-0">
              <MapPin className="w-4 h-4 text-green-500" />
              {article.district || article.state}
            </div>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {translation.title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 text-sm leading-relaxed flex-1">
          {translation.summary || translation.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..."}
        </p>
        
        <div className="flex items-center text-primary font-bold text-sm uppercase tracking-wider group-hover:text-accent transition-colors mt-auto">
          Read Full Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
