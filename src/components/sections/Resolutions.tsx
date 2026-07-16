"use client";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function Resolutions() {
  const t = useTranslations("homepage.resolutions");
  // Mocking 10 out of 25 for the grid demonstration
  const resolutions = [
    { title: t("items.1.title"), desc: t("items.1.desc") },
    { title: t("items.2.title"), desc: t("items.2.desc") },
    { title: t("items.3.title"), desc: t("items.3.desc") },
    { title: t("items.4.title"), desc: t("items.4.desc") },
    { title: t("items.5.title"), desc: t("items.5.desc") },
    { title: t("items.6.title"), desc: t("items.6.desc") },
    { title: t("items.7.title"), desc: t("items.7.desc") },
    { title: t("items.8.title"), desc: t("items.8.desc") },
    { title: t("items.9.title"), desc: t("items.9.desc") },
    { title: t("items.10.title"), desc: t("items.10.desc") },
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
              {t("title")}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-400"
            >
              {t("desc")}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 md:mt-0"
          >
            <Link href="/about/25-resolutions" className="flex items-center text-primary font-semibold hover:text-secondary transition-colors group">
              {t("view_all")} <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {resolutions.map((res, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 text-7xl font-bold text-slate-900/5 dark:text-white/5 pointer-events-none group-hover:text-primary/5 transition-colors">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="mb-6 bg-primary/10 text-primary p-3 rounded-2xl w-fit group-hover:bg-primary group-hover:text-slate-950 transition-colors duration-500">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{res.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{res.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
