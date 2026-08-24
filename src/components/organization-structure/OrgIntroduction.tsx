"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function OrgIntroduction() {
  const t = useTranslations("OrganizationStructure");

  const keywords = [
    t("intro_keywords.public_service"),
    t("intro_keywords.discipline"),
    t("intro_keywords.transparency"),
    t("intro_keywords.accountability"),
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 dark:bg-slate-900/50 skew-x-12 translate-x-1/4 -z-10" />

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-bold uppercase tracking-wider mb-4 block">
              {t("intro_eyebrow")}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              {t("intro_heading")}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6 text-lg text-slate-700 dark:text-slate-300"
            >
              <p className="font-medium text-slate-900 dark:text-slate-100 text-xl border-l-4 border-primary pl-4">
                {t("intro_p1")}
              </p>
              <p>{t("intro_p2")}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6 text-lg text-slate-700 dark:text-slate-300"
            >
              <p>{t("intro_p3")}</p>
              <p>{t("intro_p4")}</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 flex flex-wrap justify-center gap-4"
          >
            {keywords.map((word, idx) => (
              <div 
                key={idx}
                className="px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold shadow-sm border border-slate-200 dark:border-slate-800"
              >
                {word}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
