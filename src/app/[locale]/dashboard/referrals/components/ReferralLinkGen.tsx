"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReferralLinkGen({ referralCode }: { referralCode: string }) {
  const [copied, setCopied] = useState(false);
  
  const referralUrl = `https://party-member.vercel.app/membership/register?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join RAVP",
          text: `Join the Rashtriya Annadata Vikas Party using my referral code: ${referralCode}`,
          url: referralUrl,
        });
      } catch (error) {
        console.error("Error sharing", error);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
      <h3 className="font-bold text-lg mb-2">Your Referral Link</h3>
      <p className="text-sm text-slate-500 mb-6">
        Share this QR code or link with your friends to invite them to the party.
      </p>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 inline-block">
        <QRCode 
          value={referralUrl}
          size={180}
          level="H"
          className="rounded-lg"
        />
      </div>

      <div className="w-full space-y-4">
        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center overflow-hidden">
          <div className="text-sm font-semibold truncate text-slate-600 dark:text-slate-300 ml-2">
            {referralCode}
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 rounded-xl h-12"
            onClick={handleCopy}
          >
            {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
          <Button 
            className="flex-1 rounded-xl h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
