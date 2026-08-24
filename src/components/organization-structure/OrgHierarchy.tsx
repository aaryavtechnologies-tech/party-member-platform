"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { 
  Building2, 
  Map, 
  MapPin, 
  Milestone, 
  Building, 
  Home 
} from "lucide-react";

export function OrgHierarchy() {
  const t = useTranslations("OrganizationStructure");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const levels = [
    { key: "national", icon: Building2 },
    { key: "state", icon: Map },
    { key: "district", icon: MapPin },
    { key: "taluka", icon: Milestone },
    { key: "city", icon: Building },
    { key: "village", icon: Home },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 relative" ref={containerRef}>
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
          >
            {t("hierarchy_heading")}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400"
          >
            {t("hierarchy_subheading")}
          </motion.p>
        </div>

        <div className="relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 rounded-full overflow-hidden">
            <motion.div 
              style={{ height: lineHeight }} 
              className="w-full bg-primary origin-top"
            />
          </div>

          <div className="space-y-24">
            {levels.map((level, idx) => {
              const Icon = level.icon;
              const isEven = idx % 2 === 0;
              // Provide default array if get.raw fails or translation is missing
              const positions = t.raw(`levels.${level.key}.positions`) as string[];

              return (
                <div key={level.key} className={`relative flex flex-col md:flex-row items-start md:items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Timeline Node */}
                  <div className="absolute left-8 md:left-1/2 w-16 h-16 bg-white dark:bg-slate-950 border-4 border-primary rounded-full flex items-center justify-center -translate-x-1/2 z-10 shadow-lg shadow-primary/20">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>

                  {/* Content Box */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className={`w-full md:w-1/2 pl-24 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 text-left'}`}
                  >
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-colors shadow-sm">
                      <span className="text-primary font-bold text-sm tracking-widest uppercase mb-2 block">
                        {t(`levels.${level.key}.label`)}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        {t(`levels.${level.key}.heading`)}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                        {t(`levels.${level.key}.description`)}
                      </p>
                      
                      {Array.isArray(positions) && (
                        <div className={`flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                          {positions.map((pos, pIdx) => (
                            <span 
                              key={pIdx}
                              className="px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 font-medium"
                            >
                              {pos}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
