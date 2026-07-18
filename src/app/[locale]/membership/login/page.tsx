import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Member Login | Rashtriya Annadata Vikas Party",
  description: "Login to your RAVP member account to access your membership dashboard.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex">
      {/* Left decorative panel — visible on lg+ */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 flex-col items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074')" }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-slate-950/80 to-slate-950" />

        {/* Decorative blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[100px]" />

        {/* Content */}
        <div className="relative z-10 text-center px-12">
          <Link href="/" className="inline-flex items-center gap-3 mb-10">
            <img src="/logo.jpg" alt="RAVP Logo" className="w-14 h-14 rounded-full ring-2 ring-white/20" />
            <div className="text-left">
              <p className="text-white font-bold text-lg leading-tight">Rashtriya Annadata</p>
              <p className="text-white font-bold text-lg leading-tight">Vikas Party</p>
              <p className="text-primary/80 text-xs font-semibold tracking-widest uppercase">RAVP</p>
            </div>
          </Link>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Your Voice,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
              Our Strength
            </span>
          </h2>
          <p className="text-slate-300 text-lg font-light leading-relaxed max-w-sm mx-auto">
            Access your member portal to manage your membership, referrals, and more.
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 mt-10">
            {[
              { value: "1M+", label: "Members" },
              { value: "29", label: "States" },
              { value: "5K+", label: "Villages" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-12">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <img src="/logo.jpg" alt="RAVP Logo" className="w-10 h-10 rounded-full" />
          <span className="font-bold text-primary text-lg">RAVP</span>
        </div>

        <div className="w-full max-w-md">
          <LoginForm />
        </div>

        <p className="mt-8 text-xs text-slate-400 text-center">
          © {new Date().getFullYear()} Rashtriya Annadata Vikas Party. All rights reserved.
        </p>
      </div>
    </main>
  );
}
