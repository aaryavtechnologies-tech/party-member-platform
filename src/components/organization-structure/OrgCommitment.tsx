"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function OrgCommitment() {
  const t = useTranslations("OrganizationStructure");

  return (
    <section className="py-24 bg-primary text-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold uppercase tracking-wide"
          >
            {t("commitment_heading")}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-8 text-xl md:text-2xl font-medium leading-relaxed"
          >
            <p className="border-b border-slate-950/20 pb-8">
              {t("commitment_p1")}
            </p>
            <p>
              {t("commitment_p2")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
