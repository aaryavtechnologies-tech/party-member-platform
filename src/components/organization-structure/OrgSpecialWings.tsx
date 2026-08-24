"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { 
  Tractor, 
  Zap, 
  Users, 
  GraduationCap, 
  Briefcase, 
  Laptop, 
  Leaf, 
  HeartHandshake 
} from "lucide-react";

export function OrgSpecialWings() {
  const t = useTranslations("OrganizationStructure");

  // Fetch wings as array from translations
  // We use type assertion to tell TypeScript it's an array of strings
  const wings = t.raw("wings") as string[];
  
  const icons = [
    Tractor,
    Zap,
    Users,
    GraduationCap,
    Briefcase,
    Laptop,
    Leaf,
    HeartHandshake
  ];

  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
          >
            {t("wings_heading")}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400"
          >
            {t("wings_subheading")}
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {Array.isArray(wings) && wings.map((wing, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-primary/50 transition-all text-center flex flex-col items-center overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg relative z-10">{wing}</h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
