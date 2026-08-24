"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";

export function OrgWorkingPrinciples() {
  const t = useTranslations("OrganizationStructure");
  const principles = t.raw("principles") as string[];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            {t("principles_heading")}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
          {Array.isArray(principles) && principles.map((principle, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="flex items-start gap-4 p-4 rounded-xl hover:bg-white dark:hover:bg-slate-900 transition-colors"
            >
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <span className="text-lg font-medium text-slate-800 dark:text-slate-200">
                {principle}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
