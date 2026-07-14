"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Users, Globe, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MembershipCTA() {
  const benefits = [
    { title: "Digital ID Card", icon: <ShieldCheck size={24} /> },
    { title: "Leadership Roles", icon: <Award size={24} /> },
    { title: "Volunteer Network", icon: <Users size={24} /> },
    { title: "Policy Discussions", icon: <Globe size={24} /> },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084')] bg-cover bg-center opacity-20 scale-105" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-slate-950/90 to-primary/40 mix-blend-multiply" />
      
      {/* Abstract Shapes */}
      <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[120px]" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/40 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-accent font-semibold text-sm mb-8 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Join 1.5 Million+ Members
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Be a Part of the <span className="text-accent">Change</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed max-w-xl font-light">
              Join millions of citizens working together to build a stronger, more prosperous nation. Your voice and your action matters.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-accent text-slate-950 hover:bg-white text-lg font-bold rounded-full px-10 py-7 h-auto shadow-2xl shadow-accent/20 transition-all hover:scale-105">
                Register Now
              </Button>
              <Button size="lg" variant="outline" className="text-white bg-transparent border-white/30 hover:bg-white/10 hover:text-white text-lg rounded-full px-10 py-7 h-auto backdrop-blur-sm">
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4 md:gap-6"
          >
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl hover:bg-white/10 transition-colors group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h4 className="text-lg md:text-xl font-semibold text-white">{benefit.title}</h4>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
