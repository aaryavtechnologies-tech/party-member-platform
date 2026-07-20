"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function MembershipUpgradePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const currentMembership = "Primary"; // TODO: Fetch from session/context

  const handleUpgrade = async (tier: "LIFETIME_PRIMARY" | "LIFETIME_ACTIVE", amount: number) => {
    try {
      setIsLoading(true);
      
      // 1. Create order on the backend
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // 2. Initialize Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use NEXT_PUBLIC for frontend
        amount: data.amount,
        currency: data.currency,
        name: "Rashtriya Annadata Vikas Party",
        description: `Upgrade to ${tier === 'LIFETIME_PRIMARY' ? 'Lifetime Primary' : 'Lifetime Active'} Membership`,
        image: "/logo.jpg",
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify payment on the backend
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              toast.success("Payment successful! Membership upgraded.");
              router.refresh();
            } else {
              toast.error(verifyData.error || "Payment verification failed.");
            }
          } catch (error) {
            toast.error("An error occurred during verification.");
          }
        },
        theme: {
          color: "#166534", // Using the primary color
        },
      };

      const rzp1 = new window.Razorpay(options);
      
      rzp1.on("payment.failed", function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
      });

      rzp1.open();
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Upgrade Your Membership</h1>
        <p className="text-slate-500">Take an active role in the organization by upgrading your membership level. Unlock new features and contribute to national development.</p>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm mb-12">
        <h3 className="text-lg font-bold mb-6">Your Journey</h3>
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-slate-800 -z-10 rounded-full" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-1 bg-primary -z-10 rounded-full" />
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-slate-950 flex items-center justify-center shadow-lg shadow-primary/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">Primary Member</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-primary text-primary flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">Lifetime Primary</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-slate-400">Lifetime Active</span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* Tier 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-primary shadow-xl shadow-primary/10 relative flex flex-col">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-slate-950 px-4 py-1 rounded-full text-sm font-bold shadow-sm">
            Recommended Upgrade
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Lifetime Primary</h3>
          <p className="text-slate-500 text-sm mb-6">For dedicated supporters</p>
          <div className="text-4xl font-black text-slate-900 dark:text-white mb-8">
            ₹100 <span className="text-base font-medium text-slate-400">/ lifetime</span>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            {['Lifetime Digital Membership Card', 'Official Membership Certificate', 'Access to Member Dashboard', 'Priority Event Invitations', 'Referral Code Generation'].map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{benefit}</span>
              </li>
            ))}
          </ul>
          
          <Button 
            className="w-full h-14 rounded-full font-bold text-lg bg-primary text-slate-950 hover:bg-primary/90"
            onClick={() => handleUpgrade("LIFETIME_PRIMARY", 100)}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Upgrade for ₹100"}
          </Button>
        </div>

        {/* Tier 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Lifetime Active</h3>
          <p className="text-slate-500 text-sm mb-6">For core party workers</p>
          <div className="text-4xl font-black text-slate-900 dark:text-white mb-8">
            ₹1000 <span className="text-base font-medium text-slate-400">/ lifetime</span>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            {['All Lifetime Primary Benefits', 'Eligible for Party Posts', 'Voting Rights in Internal Elections', 'Direct Access to State Committees', 'Special Recognition Badge'].map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">{benefit}</span>
              </li>
            ))}
          </ul>
          
          <Button 
            variant="outline" 
            className="w-full h-14 rounded-full font-bold text-lg" 
            onClick={() => handleUpgrade("LIFETIME_ACTIVE", 1000)}
            disabled={isLoading || currentMembership === "Primary"}
          >
            Upgrade First to Lifetime Primary
          </Button>
        </div>

      </div>
    </div>
  );
}
