"use client";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

import { useTranslations } from "next-intl";

export function Vision() {
  const t = useTranslations("homepage.vision");
  
  const milestones = [
    { year: "2025", title: t("milestones.2025.title"), desc: t("milestones.2025.desc") },
    { year: "2030", title: t("milestones.2030.title"), desc: t("milestones.2030.desc") },
    { year: "2035", title: t("milestones.2035.title"), desc: t("milestones.2035.desc") },
    { year: "2047", title: t("milestones.2047.title"), desc: t("milestones.2047.desc") },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Target size={40} />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-primary mb-6"
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

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-slate-100 dark:bg-slate-800 -translate-x-1/2 hidden md:block" />

          <div className="space-y-12">
            {milestones.map((m, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center justify-between ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                <div className="md:w-1/2" />
                
                <div className="absolute left-[50%] -translate-x-1/2 w-8 h-8 bg-white dark:bg-slate-950 border-4 border-primary rounded-full hidden md:block z-10 shadow-lg shadow-primary/20" />
                
                <motion.div 
                  initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className={`md:w-1/2 ${i % 2 === 0 ? "md:pl-12" : "md:pr-12"} w-full mt-6 md:mt-0`}
                >
                  <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-shadow relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 text-7xl font-bold text-slate-900/5 dark:text-white/5 pointer-events-none">
                      {m.year}
                    </div>
                    <h3 className="text-2xl font-bold text-accent mb-2">{m.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{m.desc}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
