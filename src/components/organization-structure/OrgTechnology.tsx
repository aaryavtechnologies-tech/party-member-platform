"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Network, Database, Smartphone, LayoutDashboard, Calendar, MessageSquare, BookOpen, ShieldCheck } from "lucide-react";

export function OrgTechnology() {
  const t = useTranslations("OrganizationStructure");
  const techFeatures = t.raw("tech_features") as string[];
  
  const techIcons = [
    Database,
    ShieldCheck,
    Smartphone,
    LayoutDashboard,
    Calendar,
    MessageSquare,
    BookOpen,
    Network
  ];

  return (
    <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Abstract Tech Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ff9933_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CgkJPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIj48L3JlY3Q+CgkJPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iI2ZmZmZmZiI+PC9jaXJjbGU+Cjwvc3ZnPg==')] opacity-10" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-bold uppercase tracking-wider mb-4 block">
              {t("tech_label")}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t("tech_heading")}
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              {t("tech_description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(techFeatures) && techFeatures.map((feature, idx) => {
              const Icon = techIcons[idx % techIcons.length];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 hover:border-primary/50 transition-colors shadow-sm"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature}</h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
