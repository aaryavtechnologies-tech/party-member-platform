"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Heart, TrendingUp } from "lucide-react";

export function Mission() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary">Our Mission</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              We are dedicated to building a resilient and self-reliant nation through inclusive development, technological advancement, and the empowerment of every citizen regardless of their background.
            </p>
            
            <div className="space-y-6 pt-4">
              <div className="flex gap-4">
                <div className="mt-1 bg-accent/20 text-accent p-3 rounded-2xl h-fit">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Integrity First</h4>
                  <p className="text-slate-600 dark:text-slate-400">Upholding the highest standards of transparency and honesty in public service.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 bg-accent/20 text-accent p-3 rounded-2xl h-fit">
                  <Heart size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Service to All</h4>
                  <p className="text-slate-600 dark:text-slate-400">Ensuring our policies and actions reach the most vulnerable in society.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 bg-accent/20 text-accent p-3 rounded-2xl h-fit">
                  <TrendingUp size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Continuous Development</h4>
                  <p className="text-slate-600 dark:text-slate-400">Relentless pursuit of progress through innovation and hard work.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074')] bg-cover bg-center" />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
