import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Calendar, Share2, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  const translation = await prisma.newsTranslation.findUnique({
    where: { slug },
    include: {
      article: {
        include: { seo: true }
      }
    }
  });

  if (!translation) return { title: "News Not Found - RAVP" };

  return {
    title: translation.article.seo?.metaTitle || `${translation.title} - RAVP News`,
    description: translation.article.seo?.metaDescription || translation.summary,
    keywords: translation.article.seo?.metaKeywords,
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug } = await params;

  // Find the specific translation by slug
  const translation = await prisma.newsTranslation.findUnique({
    where: { slug },
    include: {
      article: {
        include: { categories: true, tags: true }
      }
    }
  });

  if (!translation || translation.article.status !== "PUBLISHED") {
    notFound();
  }

  // Fire-and-forget view count increment
  prisma.newsArticle.update({
    where: { id: translation.articleId },
    data: { views: { increment: 1 } }
  }).catch(() => {});

  const article = translation.article;

  return (
    <main className="bg-white dark:bg-slate-950 min-h-screen">
      
      {/* Article Header */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          
          <div className="flex justify-center items-center gap-3 mb-6">
            {article.categories.map(c => (
              <span key={c.id} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                {c.name}
              </span>
            ))}
            {article.isPressRelease && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Press Release
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-8">
            {translation.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-slate-500 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : new Date(article.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Editorial Team
            </div>
          </div>

        </div>
      </div>

      {/* Featured Image Placeholder */}
      <div className="container mx-auto px-4 max-w-5xl -mt-8 relative z-10">
        <div className="aspect-[21/9] bg-slate-200 dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10" />
        </div>
      </div>

      {/* Article Content */}
      <div className="py-20 container mx-auto px-4 max-w-3xl">
        <div className="flex justify-end mb-8">
          <Button variant="outline" className="rounded-full">
            <Share2 className="w-4 h-4 mr-2" /> Share Article
          </Button>
        </div>

        <div 
          className="prose prose-lg dark:prose-invert prose-orange max-w-none 
                     prose-headings:font-bold prose-headings:text-slate-900 
                     prose-a:text-orange-600 hover:prose-a:text-orange-700
                     prose-img:rounded-2xl prose-img:shadow-xl"
          dangerouslySetInnerHTML={{ __html: translation.content }}
        />

        {article.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
            <span className="text-sm font-bold text-slate-400 mr-2 uppercase tracking-wider self-center">Tags:</span>
            {article.tags.map(t => (
              <span key={t.id} className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-lg text-sm font-medium">
                #{t.name}
              </span>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}
