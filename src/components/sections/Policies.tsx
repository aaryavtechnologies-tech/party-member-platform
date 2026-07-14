"use client";
import { motion } from "framer-motion";
import { policies } from "@/data/mock";
import { Wheat, GraduationCap, UserCircle, BookOpen, Activity, Leaf, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";

export function Policies() {
  const iconMap: Record<string, React.ReactNode> = {
    Wheat: <Wheat size={24} />,
    GraduationCap: <GraduationCap size={24} />,
    UserCircle: <UserCircle size={24} />,
    BookOpen: <BookOpen size={24} />,
    Activity: <Activity size={24} />,
    Leaf: <Leaf size={24} />,
  };

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-primary mb-6"
          >
            Policy Highlights
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            Comprehensive frameworks designed to uplift every sector of our society.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <Tabs defaultValue={policies[0]?.id} className="w-full">
            <TabsList className="w-full h-auto flex flex-wrap justify-center gap-2 bg-transparent p-0 mb-12">
              {policies.map((policy) => (
                <TabsTrigger 
                  key={policy.id} 
                  value={policy.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-slate-950 data-[state=active]:shadow-lg rounded-full px-6 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  {iconMap[policy.icon]}
                  <span className="font-semibold">{policy.titleKey}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {policies.map((policy) => (
              <TabsContent key={policy.id} value={policy.id} className="mt-0 outline-none">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-16 border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 pointer-events-none">
                     {iconMap[policy.icon]}
                  </div>
                  <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                      <div className="w-16 h-16 bg-white dark:bg-slate-800 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                        {iconMap[policy.icon]}
                      </div>
                      <h3 className="text-3xl font-bold mb-4">{policy.titleKey}</h3>
                      <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">{policy.descriptionKey}</p>
                      
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center text-slate-700 dark:text-slate-300">
                          <div className="w-2 h-2 rounded-full bg-accent mr-3" /> Comprehensive Support Framework
                        </div>
                        <div className="flex items-center text-slate-700 dark:text-slate-300">
                          <div className="w-2 h-2 rounded-full bg-accent mr-3" /> Direct Benefits Transfer
                        </div>
                        <div className="flex items-center text-slate-700 dark:text-slate-300">
                          <div className="w-2 h-2 rounded-full bg-accent mr-3" /> Localized Implementation
                        </div>
                      </div>
                      
                      <Link href={policy.href} className={buttonVariants({ size: "lg", className: "rounded-full px-8" })}>
                        Read Full Policy <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                    
                    <div className="hidden md:block">
                      <div className="aspect-square rounded-3xl bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
                        {/* Placeholder for policy specific imagery */}
                        <div className="absolute inset-0 flex items-center justify-center text-primary/20 scale-[5]">
                          {iconMap[policy.icon]}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
