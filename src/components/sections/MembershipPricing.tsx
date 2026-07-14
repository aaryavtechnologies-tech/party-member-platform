"use client";

import { motion } from "framer-motion";
import { Check, ArrowDown, ShieldCheck, Award, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function MembershipPricing() {
  const t = useTranslations("Membership");

  const tiers = [
    {
      name: t("Primary Member"),
      price: t("Price Free"),
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      features: [
        t("Free Registration"),
        t("Unique Member ID"),
        t("QR Code"),
        t("Dashboard"),
        t("Digital Membership Card"),
      ],
      buttonText: t("Free Registration"),
      highlight: false,
    },
    {
      name: t("Lifetime Primary Member"),
      price: t("Price 100"),
      icon: <Award className="w-8 h-8 text-primary" />,
      features: [
        t("Lifetime Membership"),
        t("New Membership Card"),
        t("Certificate"),
      ],
      buttonText: t("Upgrade Button"),
      note: t("Upgrade Only"),
      highlight: false,
    },
    {
      name: t("Lifetime Active Member"),
      price: t("Price 1000"),
      icon: <Crown className="w-8 h-8 text-white" />,
      features: [
        t("Active Membership"),
        t("Organization Eligibility"),
        t("Leadership Eligibility"),
        t("Premium Membership Card"),
        t("Premium Certificate"),
      ],
      buttonText: t("Upgrade Button"),
      note: t("Upgrade Only"),
      highlight: true,
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t("title")}
          </h2>
          <p className="text-xl font-semibold text-primary mb-2">
            {t("slogan1")}
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t("slogan2")}
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto relative">
          
          {/* Vertical connection line for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-primary/20 -translate-x-1/2 rounded-full" />

          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative w-full rounded-3xl p-8 sm:p-10 z-10 flex flex-col md:flex-row gap-8 items-center ${
                tier.highlight 
                  ? "bg-primary text-slate-950 shadow-2xl shadow-primary/20 scale-100 md:scale-105 border-2 border-primary" 
                  : "bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm"
              }`}
            >
              <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                <div className={`p-4 rounded-full mb-4 ${tier.highlight ? 'bg-slate-950/10' : 'bg-primary/10'}`}>
                  {tier.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl md:text-5xl font-black">{tier.price}</span>
                </div>
                {tier.note && (
                  <span className={`text-sm font-semibold ${tier.highlight ? 'text-slate-800' : 'text-slate-500'}`}>
                    {tier.note}
                  </span>
                )}
              </div>
              
              <div className="flex-1 w-full space-y-3 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-6 md:pt-0 md:pl-8">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-1 rounded-full p-1 ${tier.highlight ? 'bg-slate-950 text-white' : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'}`}>
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span className="font-medium text-base">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="w-full md:w-auto mt-6 md:mt-0">
                <Link href={index === 0 ? "/membership/register" : "/dashboard/membership"}>
                  <Button 
                    className={`w-full md:w-40 h-14 rounded-xl text-lg font-bold transition-all hover:scale-[1.02] ${
                      tier.highlight 
                        ? 'bg-slate-950 text-white hover:bg-slate-800' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {tier.buttonText}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}

        </div>
        
        <div className="mt-20 max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <h3 className="text-2xl font-bold mb-4">Our Commitment</h3>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            {t("commitment")}
          </p>
        </div>

      </div>
    </section>
  );
}
