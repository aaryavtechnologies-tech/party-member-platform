import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { Calendar, User, FileText, Image as ImageIcon, Video, Download, Eye, Share2 as ShareIcon } from "lucide-react";

import { SocialShare } from "@/components/news/SocialShare";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { NewsCard } from "@/components/news/NewsCard";

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
  const { slug, locale } = await params;
  const headersList = await headers();
  const host = headersList.get("host") || "ravp.org";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const currentUrl = `${protocol}://${host}/news/${slug}`;

  // Find the specific translation by slug
  const translation = await prisma.newsTranslation.findUnique({
    where: { slug },
    include: {
      article: {
        include: {
          categories: true,
          tags: true,
          media: {
            include: { media: true },
            orderBy: { order: 'asc' }
          }
        }
      }
    }
  });

  if (!translation || translation.article.status !== "PUBLISHED") {
    notFound();
  }

  const article = translation.article;

  // Member Only Check
  if (article.isMemberOnly) {
    const session = await auth.api.getSession({ headers: headersList });
    if (!session) {
      redirect(`/${locale}/membership/login?redirect=/news/${slug}`);
    }
  }

  // Fire-and-forget view count increment
  prisma.newsArticle.update({
    where: { id: translation.articleId },
    data: { views: { increment: 1 } }
  }).catch(() => { });

  // Categorize Media
  const featuredImage = article.media.find(m => m.type === "FEATURED_IMAGE");
  const galleryImages = article.media.filter(m => m.type === "GALLERY_IMAGE");
  const videos = article.media.filter(m => m.type === "VIDEO");
  const documents = article.media.filter(m => m.type === "DOCUMENT");

  // Fetch Related News
  const relatedNews = await prisma.newsArticle.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: article.id },
      categories: {
        some: {
          id: { in: article.categories.map(c => c.id) }
        }
      }
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: {
      translations: true,
      categories: true,
    }
  });

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
            {article?.isMemberOnly && (
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Members Only
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-8">
            {translation.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : new Date(article.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Editorial Team
            </div>
          </div>

          <div className="flex justify-center items-center gap-6 text-xs font-bold text-slate-400 bg-white/50 dark:bg-slate-950/50 inline-flex px-6 py-2 rounded-full shadow-inner border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2" title="Total Views">
              <Eye className="w-4 h-4 text-primary" /> {article.views} Readers
            </div>
            <div className="flex items-center gap-2" title="Total Shares">
              <ShareIcon className="w-4 h-4 text-primary" /> {article.shares} Shares
            </div>
          </div>

        </div>
      </div>

      {/* Featured Image */}
      <div className="container mx-auto px-4 max-w-5xl -mt-8 relative z-10">
        <div className="aspect-[21/9] bg-slate-200 dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden relative">
          {featuredImage ? (
            <img
              src={featuredImage.media.url}
              alt={featuredImage.caption || translation.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10" />
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="py-20 container mx-auto px-4 max-w-4xl">

        {/* Social Share Toolbar */}
        <div className="flex justify-end mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <SocialShare articleId={article.id} url={currentUrl} title={translation.title} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Article Text */}
          <div className="lg:col-span-2">
            <div
              className="prose prose-lg dark:prose-invert prose-orange max-w-none 
                         prose-headings:font-bold prose-headings:text-slate-900 
                         prose-a:text-orange-600 hover:prose-a:text-orange-700
                         prose-img:rounded-2xl prose-img:shadow-xl"
              dangerouslySetInnerHTML={{ __html: translation.content }}
            />

            {article.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2">
                <span className="text-sm font-bold text-slate-400 mr-2 uppercase tracking-wider self-center">Tags:</span>
                {article.tags.map(t => (
                  <span key={t.id} className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-lg text-sm font-medium">
                    #{t.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar (Media & Downloads) */}
          <div className="lg:col-span-1 space-y-10">

            {/* Downloadable Documents */}
            {documents.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Related Documents
                </h3>
                <div className="space-y-3">
                  {documents.map(doc => (
                    <a
                      key={doc.id}
                      href={doc.media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors group"
                    >
                      <span className="text-sm font-medium truncate pr-4">{doc.caption || doc.media.filename}</span>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-primary shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {videos.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary" /> Video Coverage
                </h3>
                <div className="space-y-4">
                  {videos.map(video => (
                    <div key={video.id} className="rounded-xl overflow-hidden aspect-video bg-black">
                      <video src={video.media.url} controls className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Photo Gallery (Full width at bottom) */}
        {galleryImages.length > 0 && (
          <div className="mt-20 pt-16 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              <ImageIcon className="w-6 h-6 text-primary" /> Photo Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map(img => (
                <div key={img.id} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group relative">
                  <img
                    src={img.media.url}
                    alt={img.caption || "Gallery Image"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-900 py-20 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              Related News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedNews.map((article) => {
                const relTranslation =
                  article.translations.find((t: any) => t.language === locale) ||
                  article.translations.find((t: any) => t.language === 'en') ||
                  article.translations[0];

                return (
                  <NewsCard
                    key={article.id}
                    article={article}
                    translation={relTranslation}
                    locale={locale}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
