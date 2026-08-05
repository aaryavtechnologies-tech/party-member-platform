import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Calendar, User, FileText, Image as ImageIcon, Video, Download, Printer } from "lucide-react";
import { SocialShare } from "@/components/news/SocialShare";
import { Button } from "@/components/ui/button";
import { PrintReleaseButton, DocumentDownloadLink } from "@/components/news/PressReleaseActions";

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

  if (!translation) return { title: "Press Release Not Found - RAVP" };

  return {
    title: translation.article.seo?.metaTitle || `${translation.title} - Official Press Release`,
    description: translation.article.seo?.metaDescription || translation.summary,
    keywords: translation.article.seo?.metaKeywords,
  };
}

export default async function PressReleaseDetailsPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const currentUrl = `https://ravp.org/media/press-release/${slug}`; // Replace with actual protocol/host if needed

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

  if (!translation || translation.article.status !== "PUBLISHED" || !translation.article.isPressRelease) {
    notFound();
  }

  const article = translation.article;
  const documents = article.media.filter(m => m.type === "DOCUMENT");
  const galleryImages = article.media.filter(m => m.type === "GALLERY_IMAGE" || m.type === "FEATURED_IMAGE");
  const videos = article.media.filter(m => m.type === "VIDEO");

  // Track views
  prisma.newsArticle.update({
    where: { id: article.id },
    data: { views: { increment: 1 } }
  }).catch(() => {});

  return (
    <main className="bg-white dark:bg-slate-950 min-h-screen pt-32 pb-20">
      
      {/* Official Banner */}
      <div className="bg-blue-900 text-white py-12 mb-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-blue-200 mb-4">Official Press Release</h2>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
            {translation.title}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            {translation.summary}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : new Date(article.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Publishing Officer
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <FileText className="w-4 h-4" />
                {article.categories[0]?.name || "General"}
              </div>
            </div>

            {/* Print & Share (Top) */}
            <div className="flex justify-between items-center mb-8">
              <PrintReleaseButton articleId={article.id} />
              <SocialShare articleId={article.id} url={currentUrl} title={translation.title} />
            </div>

            {/* Content Body */}
            <div 
              className="prose prose-lg dark:prose-invert max-w-none 
                         prose-headings:font-bold prose-headings:text-slate-900 
                         prose-a:text-blue-600 hover:prose-a:text-blue-700 font-serif leading-relaxed mb-12"
              dangerouslySetInnerHTML={{ __html: translation.content }}
            />

            {/* Media Contact Block */}
            {(article.contactName || article.contactEmail || article.contactMobile) && (
              <div className="mt-12 p-8 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded-r-2xl">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Media Contact</h3>
                <div className="space-y-2 text-slate-700 dark:text-slate-300">
                  {article.contactName && (
                    <p className="font-bold text-lg">{article.contactName}</p>
                  )}
                  {article.contactDesignation && (
                    <p className="text-slate-500 font-semibold">{article.contactDesignation}</p>
                  )}
                  {(article.contactEmail || article.contactMobile) && (
                    <div className="mt-4 space-y-1">
                      {article.contactEmail && (
                        <p><strong>Email:</strong> <a href={`mailto:${article.contactEmail}`} className="text-blue-600 hover:underline">{article.contactEmail}</a></p>
                      )}
                      {article.contactMobile && (
                        <p><strong>Mobile:</strong> <a href={`tel:${article.contactMobile}`} className="text-blue-600 hover:underline">{article.contactMobile}</a></p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Official PDF Downloads */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                <Download className="w-5 h-5 text-blue-600" /> Official Downloads
              </h3>
              
              <div className="space-y-3">
                {documents.map(doc => (
                  <DocumentDownloadLink key={doc.id} articleId={article.id} document={doc} />
                ))}
                {documents.length === 0 && (
                  <p className="text-sm text-slate-500 italic">No attachments available for this release.</p>
                )}
              </div>
            </div>

            {/* Media Resources */}
            {(galleryImages.length > 0 || videos.length > 0) && (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                  <ImageIcon className="w-5 h-5 text-blue-600" /> Media Resources
                </h3>
                
                {galleryImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Attached Images</p>
                    <div className="grid grid-cols-2 gap-2">
                      {galleryImages.slice(0, 4).map(img => (
                        <a key={img.id} href={img.media.url} target="_blank" rel="noopener noreferrer" className="aspect-square bg-slate-200 rounded-lg overflow-hidden border border-slate-200">
                          <img src={img.media.url} className="w-full h-full object-cover" alt="Press Release Media" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
