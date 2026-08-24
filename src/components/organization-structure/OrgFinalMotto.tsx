"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowRight, Info } from "lucide-react";

export function OrgFinalMotto() {
  const t = useTranslations("OrganizationStructure");

  return (
    <section className="py-32 bg-slate-50 dark:bg-slate-900 flex items-center justify-center relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary mb-6 leading-tight">
              {t("motto_main")}
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium italic">
              {t("motto_secondary")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <Link href="/membership/register" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-primary hover:bg-primary/90 text-slate-950 font-bold shadow-xl shadow-primary/30 group w-full sm:w-auto">
                {t("cta_join")} <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            
            <Link href="/policies" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 w-full sm:w-auto">
                <Info className="mr-2 h-5 w-5" /> {t("cta_learn")}
              </Button>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
