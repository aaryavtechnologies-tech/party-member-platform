"use client";
import { motion } from "framer-motion";
import { ArrowRight, History, MessageSquareQuote } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export function About() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-primary mb-4"
          >
            About Us
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-1.5 w-24 bg-accent mx-auto rounded-full"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Journey Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 md:p-12 transition-all hover:shadow-2xl hover:shadow-primary/10"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <History size={120} />
            </div>
            <div className="relative z-10">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <History size={32} />
              </div>
              <h3 className="text-3xl font-bold mb-4">Our Journey</h3>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
                From a small group of passionate citizens to a nationwide movement, our journey has been driven by a singular focus: the progress and prosperity of our great nation.
              </p>
              <Link href="/about/journey" className={buttonVariants({ variant: "ghost", className: "group/btn text-primary hover:text-primary hover:bg-primary/5" })}>
                <span className="flex items-center">
                  Read Full Journey
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Founder Message Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-3xl bg-primary text-white p-8 md:p-12 transition-all hover:shadow-2xl hover:shadow-primary/30"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <MessageSquareQuote size={120} />
            </div>
            <div className="relative z-10">
              <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquareQuote size={32} />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-accent">Founder's Message</h3>
              <p className="text-white/90 text-lg leading-relaxed mb-8">
                "Our strength lies in our unity and our unwavering commitment to the values that define us. Together, we can build a future that honors our past and secures our children's tomorrow."
              </p>
              <Link href="/about/founder-message" className={buttonVariants({ variant: "outline", className: "group/btn border-white/30 text-primary hover:bg-white/10 hover:text-slate-950 bg-white/90" })}>
                <span className="flex items-center">
                  Read Message
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
