"use client";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";

export function Resolutions() {
  // Mocking 10 out of 25 for the grid demonstration
  const resolutions = [
    { title: "Universal Healthcare", desc: "Top-tier medical facilities in every taluka." },
    { title: "Quality Education", desc: "Modernizing schools with digital infrastructure." },
    { title: "Farmer Empowerment", desc: "Fair prices and modern tools for agriculture." },
    { title: "Women Safety", desc: "Strict policies and support systems nationwide." },
    { title: "Youth Employment", desc: "Creating 10 million jobs in emerging sectors." },
    { title: "Green Energy", desc: "50% power grid to renewables by 2030." },
    { title: "Digital India", desc: "100% broadband connectivity in rural areas." },
    { title: "Water Security", desc: "Clean drinking water for every household." },
    { title: "Infrastructure", desc: "World-class roads and bullet trains." },
    { title: "Global Economy", desc: "Top 3 global manufacturing hubs." },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-primary mb-4"
            >
              Our 25 National Resolutions
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-400"
            >
              The 25 pillars of our commitment to building a completely developed nation by 2047.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 md:mt-0"
          >
            <Link href="/about/25-resolutions" className="flex items-center text-primary font-semibold hover:text-secondary transition-colors group">
              View All 25 Resolutions <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {resolutions.map((res, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 text-7xl font-bold text-slate-900/5 dark:text-white/5 pointer-events-none group-hover:text-primary/5 transition-colors">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="mb-6 bg-primary/10 text-primary p-3 rounded-2xl w-fit group-hover:bg-primary group-hover:text-slate-950 transition-colors duration-500">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{res.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{res.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
