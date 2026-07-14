"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, Share2 } from "lucide-react";

export default function CertificatePage() {
  const certRef = useRef<HTMLDivElement>(null);

  const downloadCert = async () => {
    const html2canvas = (await import("html2canvas")).default;
    if (certRef.current) {
      const canvas = await html2canvas(certRef.current, { scale: 2 });
      const link = document.createElement("a");
      link.download = "ravp_certificate.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Membership Certificate</h1>
          <p className="text-slate-500">Your official certificate of membership.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full" onClick={downloadCert}>
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

      <div className="overflow-x-auto pb-8">
        <div className="min-w-[800px] flex justify-center">
          {/* Certificate Container for html2canvas */}
          <div 
            ref={certRef}
            className="w-full max-w-4xl bg-white border-[16px] border-primary/20 p-2 relative shadow-2xl"
            style={{ aspectRatio: "1.414 / 1" }} // A4 Landscape ratio
          >
            <div className="w-full h-full border-4 border-primary/40 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden bg-[url('/noise.png')]">
              
              {/* Decorative Corners */}
              <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-primary" />
              <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-primary" />
              <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-primary" />
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-primary" />

              {/* Header */}
              <h1 className="text-5xl font-black text-primary tracking-tighter mb-2">RAVP</h1>
              <h2 className="text-xl font-bold text-slate-600 uppercase tracking-[0.3em] mb-12">Rashtriya Adarsh Vikas Party</h2>
              
              <h3 className="text-4xl font-serif text-slate-900 italic mb-10">Certificate of Membership</h3>
              
              <p className="text-lg text-slate-600 mb-4">This is to certify that</p>
              <h4 className="text-5xl font-bold text-slate-900 border-b-2 border-slate-300 pb-2 px-12 mb-8">Himanshu Kumar</h4>
              
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed mb-12">
                is a registered <strong className="text-slate-900">Lifetime Primary Member</strong> of the Rashtriya Adarsh Vikas Party (Member ID: RAVP000245) and is committed to upholding the core values and vision of the organization.
              </p>

              {/* Signatures */}
              <div className="w-full flex justify-between px-16 mt-auto">
                <div className="text-center">
                  <div className="w-40 h-12 border-b border-slate-400 mb-2" />
                  <p className="text-sm font-bold text-slate-900 uppercase">National President</p>
                </div>
                <div className="text-center">
                  <div className="w-40 h-12 border-b border-slate-400 mb-2 flex items-end justify-center pb-2">
                    <span className="font-bold text-slate-900">14 / 07 / 2026</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 uppercase">Date of Issue</p>
                </div>
                <div className="text-center">
                  <div className="w-40 h-12 border-b border-slate-400 mb-2" />
                  <p className="text-sm font-bold text-slate-900 uppercase">General Secretary</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
