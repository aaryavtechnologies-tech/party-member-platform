"use client";
import { motion } from "framer-motion";
import { Network, ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";

export function Organization() {
  const t = useTranslations("homepage.organization");
  
  const levels = [
    { title: t("levels.1.title"), count: t("levels.1.count"), desc: t("levels.1.desc"), delay: 0.1 },
    { title: t("levels.2.title"), count: t("levels.2.count"), desc: t("levels.2.desc"), delay: 0.2 },
    { title: t("levels.3.title"), count: t("levels.3.count"), desc: t("levels.3.desc"), delay: 0.3 },
    { title: t("levels.4.title"), count: t("levels.4.count"), desc: t("levels.4.desc"), delay: 0.4 },
    { title: t("levels.5.title"), count: t("levels.5.count"), desc: t("levels.5.desc"), delay: 0.5 },
  ];

  return (
    <section className="py-32 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
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

        <div className="max-w-4xl mx-auto relative">
          {/* Animated vertical connector line */}
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute left-[50%] top-0 w-1 bg-gradient-to-b from-primary via-accent to-primary/20 -translate-x-1/2 hidden md:block rounded-full"
          />

          <div className="space-y-6 md:space-y-12">
            {levels.map((lvl, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: lvl.delay, type: "spring", stiffness: 100 }}
                  className="bg-white dark:bg-slate-950 w-full max-w-md p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 text-center shadow-2xl shadow-primary/5 hover:border-primary/50 hover:shadow-primary/20 transition-all cursor-pointer group relative"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity transform group-hover:scale-150 duration-500 pointer-events-none">
                    <Network size={80} />
                  </div>
                  
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-slate-950 transition-colors duration-500 shadow-sm relative z-10">
                    <Network size={32} />
                  </div>
                  <h3 className="font-bold text-2xl mb-2 relative z-10">{lvl.title}</h3>
                  <p className="text-sm text-accent font-bold uppercase tracking-widest mb-4 relative z-10">{lvl.count}</p>
                  <p className="text-slate-500 dark:text-slate-400 relative z-10">{lvl.desc}</p>
                </motion.div>
                
                {i < levels.length - 1 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: lvl.delay + 0.2 }}
                    className="md:hidden mt-6 text-primary/30"
                  >
                    <ArrowDown size={32} />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
