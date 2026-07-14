"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, Share2, ShieldCheck } from "lucide-react";
import QRCode from "react-qr-code";

interface CardData {
  name: string;
  memberId: string;
  photoUrl: string | null | undefined;
  issueDate: string;
  location: string;
  membershipType: string;
}

export default function DigitalCardClient({ data }: { data: CardData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadCard = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      if (cardRef.current) {
        const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true });
        const link = document.createElement("a");
        link.download = `RAVP_ID_${data.memberId}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    } catch (error) {
      console.error("Failed to generate ID card image", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const printCard = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Digital Identity Card</h1>
          <p className="text-slate-500">Your official digital membership card. Keep it handy.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full" onClick={downloadCard} disabled={isDownloading}>
            <Download className="w-4 h-4 mr-2" /> {isDownloading ? "Processing..." : "Download"}
          </Button>
          <Button variant="outline" className="rounded-full print:hidden" onClick={printCard}>
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button className="rounded-full bg-primary text-slate-950 hover:bg-primary/90 print:hidden">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </div>

      <div className="flex justify-center items-center py-10 print:py-0 print:block">
        {/* Card Container for html2canvas */}
        <div 
          ref={cardRef} 
          className="relative w-full max-w-sm rounded-[2rem] overflow-hidden bg-white shadow-2xl shadow-slate-900/10 border border-slate-100 print:shadow-none print:border-black"
          style={{ aspectRatio: "63/100" }} 
        >
          {/* Header */}
          <div className="h-32 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden flex flex-col items-center justify-center text-white p-4 text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-xl rounded-full -mr-10 -mt-10" />
            <h2 className="font-black text-3xl tracking-tighter relative z-10 text-white drop-shadow-md">RAVP</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest relative z-10 opacity-90 drop-shadow-sm">Rashtriya Adarsh Vikas Party</p>
          </div>

          {/* Photo */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 flex items-center justify-center z-20">
            {data.photoUrl ? (
              <img src={data.photoUrl} alt="Member Photo" className="w-full h-full object-cover" crossOrigin="anonymous" />
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-2xl">
                {data.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="pt-24 pb-6 px-6 text-center h-full flex flex-col relative z-10 bg-white">
            <h3 className="text-2xl font-bold text-slate-900 leading-tight">{data.name}</h3>
            <p className="text-sm font-bold text-orange-600 mb-6">{data.membershipType}</p>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-left text-sm mb-6 flex-1">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Member ID</p>
                <p className="font-bold text-slate-900">{data.memberId}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Issue Date</p>
                <p className="font-bold text-slate-900">{data.issueDate}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Location</p>
                <p className="font-bold text-slate-900 truncate">{data.location}</p>
              </div>
            </div>

            {/* Footer & QR */}
            <div className="border-t border-slate-100 pt-4 flex justify-between items-center bg-white">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <ShieldCheck className="w-4 h-4 text-green-500" /> Verified Member
              </div>
              <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-200">
                {/* Dynamically generate QR code to point to public verify page */}
                <QRCode value={`https://party.com/verify/member/${data.memberId}`} size={54} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
