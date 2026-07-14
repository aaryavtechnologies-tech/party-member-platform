"use client";

import { motion } from "framer-motion";
import { Users, Link as LinkIcon, BarChart3, Star } from "lucide-react";
import { useTranslations } from "next-intl";

export function ReferralPromo() {
  const t = useTranslations("Referral");

  const features = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: t("Total Referred Members"),
    },
    {
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      title: t("Active Members"),
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
      title: t("Lifetime Active Members"),
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
              {t("title")}
            </h2>
            <div className="w-20 h-2 bg-primary rounded-full"></div>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {t("description")}
            </p>
          </div>

          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:shadow-lg transition-all"
              >
                <div className="p-4 bg-white dark:bg-slate-950 rounded-full shadow-sm">
                  {feature.icon}
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  {feature.title}
                </h4>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
