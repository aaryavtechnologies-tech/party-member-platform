"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

export function OrgLeadershipJourney() {
  const t = useTranslations("OrganizationStructure");
  const journeySteps = t.raw("journey_steps") as string[];

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-slate-900 dark:text-white mb-4"
          >
            {t("journey_heading")}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto"
          >
            {t("journey_description")}
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
          {Array.isArray(journeySteps) && journeySteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex items-center"
            >
              <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-6 py-4 rounded-xl font-bold text-center shadow-sm">
                {step}
              </div>
              
              {idx < journeySteps.length - 1 && (
                <div className="ml-4 md:ml-8 text-primary hidden sm:block">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
