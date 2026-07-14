"use client";

import { motion } from "framer-motion";
import { Check, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export function MembershipPricing() {
  const tiers = [
    {
      name: "Primary Member",
      price: "Free",
      description: "Join the movement and show your support as a foundational member.",
      features: [
        "Digital ID Card",
        "Access to Local Meetings",
        "Weekly Newsletters",
        "Volunteer Opportunities",
        "Voting in Primary Internal Polls"
      ],
      icon: <ShieldCheck className="w-6 h-6 text-slate-700 dark:text-slate-300" />,
      highlight: false,
      buttonText: "Join for Free",
      buttonVariant: "outline"
    },
    {
      name: "Lifetime Active Member",
      price: "₹1,000",
      period: "/ lifetime",
      description: "Take on a leadership role and actively participate in organizational decisions.",
      features: [
        "Premium Physical & Digital ID Card",
        "Eligible for Organizational Positions",
        "Direct Line to State Leadership",
        "Exclusive Strategy Briefings",
        "Full Voting Rights in All Party Matters",
        "Priority Support & Grievance Resolution"
      ],
      icon: <Star className="w-6 h-6 text-white" />,
      highlight: true,
      buttonText: "Become an Active Member",
      buttonVariant: "default"
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Choose Your Level of Involvement
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Whether you want to show your foundational support or take an active leadership role in your district, we have a place for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative rounded-3xl p-8 sm:p-10 ${
                tier.highlight 
                  ? "bg-primary text-slate-950 shadow-2xl shadow-primary/20 scale-100 md:scale-105 z-10 border-2 border-primary" 
                  : "bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm"
              }`}
            >
              {tier.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">
                  Recommended for Leaders
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl ${tier.highlight ? 'bg-slate-950/10' : 'bg-slate-100 dark:bg-slate-900'}`}>
                  {tier.icon}
                </div>
                <h3 className="text-2xl font-bold">{tier.name}</h3>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl md:text-5xl font-black">{tier.price}</span>
                {tier.period && <span className={`text-sm font-semibold ml-2 ${tier.highlight ? 'text-slate-800' : 'text-slate-500'}`}>{tier.period}</span>}
              </div>
              
              <p className={`mb-8 h-12 ${tier.highlight ? 'text-slate-800' : 'text-slate-500'}`}>
                {tier.description}
              </p>
              
              <div className="space-y-4 mb-10">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-full p-1 ${tier.highlight ? 'bg-slate-950 text-white' : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'}`}>
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span className="font-medium text-sm sm:text-base">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/membership/register">
                <Button 
                  className={`w-full h-14 rounded-xl text-lg font-bold transition-all hover:scale-[1.02] ${
                    tier.highlight 
                      ? 'bg-slate-950 text-white hover:bg-slate-800 shadow-xl shadow-slate-950/20' 
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700'
                  }`}
                >
                  {tier.buttonText}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
