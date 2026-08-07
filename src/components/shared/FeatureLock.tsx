"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, CreditCard } from "lucide-react";
import "@/styles/designTokens.css";

interface FeatureLockProps {
  isPaidOrInGracePeriod: boolean;
  requiredTier?: string;
  children: React.ReactNode;
}

export function FeatureLock({ isPaidOrInGracePeriod, requiredTier, children }: FeatureLockProps) {
  const router = useRouter();
  const [showLock, setShowLock] = useState(false);

  useEffect(() => {
    if (!isPaidOrInGracePeriod) {
      setShowLock(true);
    }
  }, [isPaidOrInGracePeriod]);

  if (isPaidOrInGracePeriod) {
    return <>{children}</>;
  }

  if (showLock) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Animated backdrop with heavy blur */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-fade-in" />
        
        {/* Ambient glow behind the card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="bg-slate-900/60 dark:bg-slate-950/80 rounded-3xl shadow-[0_0_50px_-12px_rgba(255,153,51,0.25)] max-w-lg w-full p-8 sm:p-10 text-center relative overflow-hidden border border-white/10 dark:border-slate-800 animate-fade-in z-10 backdrop-blur-md">
          
          {/* Decorative glowing top edge */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-70" />
          
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-orange-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,153,51,0.4)]">
              <Lock className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>
          
          <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
            Premium Access Required
          </h2>
          
          <p className="text-slate-300 mb-10 leading-relaxed text-lg">
            {requiredTier === "LIFETIME_ACTIVE" 
              ? <>You must upgrade to the <strong className="text-white">Lifetime Active (₹1000)</strong> plan to unlock <strong className="text-white">Member Communities</strong> and chat features.</>
              : <>Your grace period has expired. Please activate your membership plan to unlock <strong className="text-white">Digital ID Card, Certificates</strong>, and <strong className="text-white">Unlimited Referrals</strong>.</>
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/dashboard/membership")}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-orange-500 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,153,51,0.5)] hover:-translate-y-1"
            >
              <CreditCard className="w-6 h-6" />
              Activate Membership
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Placeholder while evaluating
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
