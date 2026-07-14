"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, Share2, ShieldCheck, QrCode as QrIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function DigitalCardPage() {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadCard = async () => {
    // Dynamic import to avoid SSR issues
    const html2canvas = (await import("html2canvas")).default;
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, { scale: 2 });
      const link = document.createElement("a");
      link.download = "ravp_member_card.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Digital Identity Card</h1>
          <p className="text-slate-500">Your official digital membership card. Keep it handy.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full" onClick={downloadCard}>
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
          <Button variant="outline" className="rounded-full">
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button className="rounded-full bg-primary text-slate-950 hover:bg-primary/90">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </div>

      <div className="flex justify-center items-center py-10">
        {/* Card Container for html2canvas */}
        <div 
          ref={cardRef} 
          className="relative w-full max-w-sm rounded-[2rem] overflow-hidden bg-white shadow-2xl shadow-slate-900/10 border border-slate-100"
          style={{ aspectRatio: "63/100" }} // Standard ID card ratio (vertical)
        >
          {/* Header */}
          <div className="h-32 bg-gradient-to-br from-primary to-accent relative overflow-hidden flex flex-col items-center justify-center text-slate-950 p-4 text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-xl rounded-full -mr-10 -mt-10" />
            <h2 className="font-black text-2xl tracking-tighter relative z-10">RAVP</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest relative z-10 opacity-80">Rashtriya Adarsh Vikas Party</p>
          </div>

          {/* Photo */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 flex items-center justify-center">
            {/* Placeholder for user photo */}
            <div className="w-full h-full bg-slate-200" />
          </div>

          {/* Details */}
          <div className="pt-20 pb-6 px-6 text-center h-full flex flex-col">
            <h3 className="text-2xl font-bold text-slate-900">Himanshu Kumar</h3>
            <p className="text-sm font-semibold text-primary mb-6">Lifetime Primary Member</p>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-left text-sm mb-6 flex-1">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Member ID</p>
                <p className="font-bold text-slate-900">RAVP000245</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Issue Date</p>
                <p className="font-bold text-slate-900">14 Jul 2026</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">State / District</p>
                <p className="font-bold text-slate-900">Delhi / New Delhi</p>
              </div>
            </div>

            {/* Footer & QR */}
            <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <ShieldCheck className="w-4 h-4 text-green-500" /> Verified Member
              </div>
              <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-200">
                <QRCodeSVG value="https://party.com/verify/RAVP000245" size={54} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
