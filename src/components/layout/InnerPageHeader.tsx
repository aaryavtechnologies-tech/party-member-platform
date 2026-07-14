"use client";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";

interface InnerPageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: { label: string; href: string }[];
}

export function InnerPageHeader({ title, description, breadcrumbs }: InnerPageHeaderProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-950 flex items-center">
      {/* Background with parallax and overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
        <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Breadcrumbs */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2 text-sm text-slate-400 mb-8"
        >
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center space-x-2">
              <ChevronRight size={14} />
              <Link 
                href={crumb.href as any} 
                className={`transition-colors ${index === breadcrumbs.length - 1 ? 'text-white font-medium' : 'hover:text-primary'}`}
              >
                {crumb.label}
              </Link>
            </div>
          ))}
        </motion.nav>

        {/* Title & Description */}
        <div className="max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            {title}
          </motion.h1>
          
          {description && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-300 font-light max-w-2xl"
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
