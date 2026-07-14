"use client";
import { motion } from "framer-motion";
import { ArrowRight, Play, Image as ImageIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export function Media() {
  const news = [
    { type: "Press Release", date: "Oct 12, 2024", title: "National Committee announces new rural development initiative.", img: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=2070" },
    { type: "News", date: "Oct 10, 2024", title: "Millions gather for the historic unified sankalp rally in capital.", img: "https://images.unsplash.com/photo-1541872526845-8120e2a9e525?q=80&w=2069" },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-primary mb-4"
            >
              Latest Media & Updates
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-400"
            >
              Stay informed with our latest news, press releases, and galleries.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 md:mt-0 flex gap-4"
          >
            <Link href="/media/photo-gallery" className={buttonVariants({ variant: "outline", className: "rounded-full" })}>
              <ImageIcon className="mr-2 h-4 w-4" /> Photos
            </Link>
            <Link href="/media/video-gallery" className={buttonVariants({ variant: "outline", className: "rounded-full" })}>
              <Play className="mr-2 h-4 w-4" /> Videos
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Featured Article - Spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 group rounded-[2.5rem] overflow-hidden relative cursor-pointer min-h-[500px] flex items-end"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="relative z-10 p-10 md:p-12 w-full">
              <div className="bg-accent text-primary px-4 py-1.5 rounded-full text-xs font-bold w-fit mb-4 uppercase tracking-widest">
                Featured Article
              </div>
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-accent transition-colors">
                How the new education policy is shaping the future of young minds.
              </h3>
              <div className="flex items-center text-white/80 gap-4 mb-6">
                <span>Oct 05, 2024</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                <span>5 min read</span>
              </div>
              <div className="text-white font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                Read Full Article <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            </div>
          </motion.div>

          {/* Side Articles */}
          <div className="flex flex-col gap-6 md:gap-8">
            {news.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group bg-white dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary/10 transition-all cursor-pointer flex-1 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${item.img})` }} />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary">
                    {item.type}
                  </div>
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-widest">{item.date}</div>
                  <h3 className="text-xl font-bold mb-4 line-clamp-3 group-hover:text-primary transition-colors">{item.title}</h3>
                  <div className="text-primary text-sm font-semibold flex items-center group-hover:text-accent mt-auto">
                    Read More <ArrowRight className="ml-1.5 h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/media" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-full px-8 border-slate-200 hover:bg-primary hover:text-white transition-colors" })}>
            View All News & Updates
          </Link>
        </div>
      </div>
    </section>
  );
}
