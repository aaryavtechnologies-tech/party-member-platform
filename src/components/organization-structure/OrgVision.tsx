"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { 
  Globe2, 
  HeartHandshake, 
  Scale, 
  ShieldCheck, 
  Users2, 
  Cpu 
} from "lucide-react";

export function OrgVision() {
  const t = useTranslations("OrganizationStructure");

  const cards = [
    {
      key: "nationwide",
      icon: Globe2,
    },
    {
      key: "service",
      icon: HeartHandshake,
    },
    {
      key: "opportunity",
      icon: Scale,
    },
    {
      key: "transparency",
      icon: ShieldCheck,
    },
    {
      key: "inclusive",
      icon: Users2,
    },
    {
      key: "modern",
      icon: Cpu,
    },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-slate-900 dark:text-white mb-4"
          >
            {t("vision_heading")}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400"
          >
            {t("vision_subheading")}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-950 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {t(`vision_cards.${card.key}.title`)}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t(`vision_cards.${card.key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
