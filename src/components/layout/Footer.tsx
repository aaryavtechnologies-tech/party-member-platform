"use client";

import { Link } from "@/i18n/routing";
import { MapPin, Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  mobile: z.string().min(10, { message: "Valid mobile number is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  subject: z.string().min(5, { message: "Subject is required." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export function Footer() {
  const t = useTranslations("Navigation");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Handle form submission
  }

  return (
    <footer className="bg-slate-950 text-slate-300 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      {/* Contact Section */}
      <div className="container mx-auto px-4 pt-24 pb-16 border-b border-slate-800 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Get in Touch</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-md">
              We are here to listen. Whether you have a suggestion, a grievance, or simply want to volunteer, reach out to us.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-primary shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">National Headquarters</h4>
                  <p className="text-slate-400 leading-relaxed">123 Democracy Avenue, New Delhi, India 110001</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-primary shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Toll-Free Number</h4>
                  <p className="text-slate-400">1800-123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-primary shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Email Support</h4>
                  <p className="text-slate-400">contact@organization.in</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input 
                    placeholder="Full Name" 
                    className="bg-white/5 border-white/10 focus-visible:ring-primary text-white placeholder:text-slate-500 h-12" 
                    {...form.register("name")} 
                  />
                  {form.formState.errors.name && <p className="text-xs text-red-500 mt-1">{form.formState.errors.name.message}</p>}
                </div>
                <div>
                  <Input 
                    placeholder="Mobile Number" 
                    className="bg-white/5 border-white/10 focus-visible:ring-primary text-white placeholder:text-slate-500 h-12" 
                    {...form.register("mobile")} 
                  />
                  {form.formState.errors.mobile && <p className="text-xs text-red-500 mt-1">{form.formState.errors.mobile.message}</p>}
                </div>
              </div>
              <div>
                <Input 
                  placeholder="Email Address" 
                  className="bg-white/5 border-white/10 focus-visible:ring-primary text-white placeholder:text-slate-500 h-12" 
                  {...form.register("email")} 
                />
                {form.formState.errors.email && <p className="text-xs text-red-500 mt-1">{form.formState.errors.email.message}</p>}
              </div>
              <div>
                <Input 
                  placeholder="Subject" 
                  className="bg-white/5 border-white/10 focus-visible:ring-primary text-white placeholder:text-slate-500 h-12" 
                  {...form.register("subject")} 
                />
                {form.formState.errors.subject && <p className="text-xs text-red-500 mt-1">{form.formState.errors.subject.message}</p>}
              </div>
              <div>
                <Textarea 
                  placeholder="Your Message" 
                  className="bg-white/5 border-white/10 focus-visible:ring-primary text-white placeholder:text-slate-500 min-h-[120px] resize-none" 
                  {...form.register("message")} 
                />
                {form.formState.errors.message && <p className="text-xs text-red-500 mt-1">{form.formState.errors.message.message}</p>}
              </div>
              <Button type="submit" className="w-full h-12 text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 text-slate-950">
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <img src="/logo.jpg" alt="RAVP Logo" className="w-16 h-16 rounded-full bg-white p-1" />
              <span className="font-bold text-2xl text-white">
                રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી (RAVP)
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm mb-6">
              Building a stronger, more prosperous nation through unity, transparency, and relentless development.
            </p>
            <Link href="/membership/register" className={buttonVariants({ variant: "outline", className: "bg-transparent border-white/20 text-white hover:bg-white/10 rounded-full" })}>
              {t("become_member")}
            </Link>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">{t("about")}</h4>
            <ul className="space-y-3">
              <li><Link href="/about/journey" className="hover:text-primary transition-colors">{t("our_journey")}</Link></li>
              <li><Link href="/about/vision-2047" className="hover:text-primary transition-colors">{t("vision_2047")}</Link></li>
              <li><Link href="/about/25-resolutions" className="hover:text-primary transition-colors">{t("resolutions_25")}</Link></li>
              <li><Link href="/about/mission" className="hover:text-primary transition-colors">{t("mission")} & {t("core_values")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/policies" className="hover:text-primary transition-colors">Our Policies</Link></li>
              <li><Link href="/organization/structure" className="hover:text-primary transition-colors">Organization</Link></li>
              <li><Link href="/media/news" className="hover:text-primary transition-colors">Latest News</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link href="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Rashtriya Annadata Vikas Party (RAVP). All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center"><MapPin size={14} className="mr-1"/> India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
