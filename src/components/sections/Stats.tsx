"use client";
import { motion } from "framer-motion";
import { statistics } from "@/data/mock";
import { Users, HandHeart, Map, Home, Flag } from "lucide-react";
import { useTranslations } from "next-intl";

export function Stats() {
  const t = useTranslations("homepage.stats");
  const iconMap: Record<string, React.ReactNode> = {
    Users: <Users size={32} />,
    HandHeart: <HandHeart size={32} />,
    Map: <Map size={32} />,
    Home: <Home size={32} />,
    Flag: <Flag size={32} />,
  };

  return (
    <section className="relative -mt-24 z-20 pb-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {statistics.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-6 md:p-8 rounded-[2rem] text-center shadow-xl shadow-slate-900/5 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 transition-all group"
            >
              <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-slate-950 transition-colors duration-500">
                {iconMap[stat.icon]}
              </div>
              <motion.h3 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2"
              >
                {stat.value >= 1000000 ? `${(stat.value / 1000000).toFixed(1)}M+` : stat.value >= 1000 ? `${(stat.value / 1000).toFixed(0)}k+` : `${stat.value}+`}
              </motion.h3>
              <p className="text-sm md:text-base font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t(stat.labelKey as any)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
