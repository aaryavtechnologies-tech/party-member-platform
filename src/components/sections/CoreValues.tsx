"use client";
import { motion } from "framer-motion";
import { coreValues } from "@/data/mock";
import { Eye, Users, Heart, ShieldCheck, Lightbulb, Zap } from "lucide-react";

export function CoreValues() {
  const iconMap: Record<string, React.ReactNode> = {
    Eye: <Eye size={32} />,
    Users: <Users size={32} />,
    Heart: <Heart size={32} />,
    ShieldCheck: <ShieldCheck size={32} />,
    Lightbulb: <Lightbulb size={32} />,
    Zap: <Zap size={32} />,
  };

  return (
    <section className="py-24 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-16 text-accent"
        >
          Our Core Values
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {coreValues.map((val, i) => (
            <motion.div
              key={val.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center group"
            >
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-accent group-hover:text-primary group-hover:scale-110 shadow-lg">
                {iconMap[val.icon]}
              </div>
              <h3 className="text-xl font-semibold tracking-wide">{val.titleKey}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
