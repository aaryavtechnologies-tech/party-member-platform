"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface CertificateData {
  name: string;
  memberId: string;
  membershipType: string;
  issueDate: string;
}

export default function CertificateClient({ data }: { data: CertificateData }) {
  const certRef = useRef<HTMLDivElement>(null);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header — hidden when printing */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Membership Certificate</h1>
          <p className="text-slate-500">Your official certificate of membership.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto pb-8 print:overflow-visible print:pb-0">
        <div className="min-w-[800px] flex justify-center print:min-w-0 print:block">
          {/* Certificate — given a unique id so the print CSS can target it precisely */}
          <div
            ref={certRef}
            id="cert-print-root"
            className="w-full max-w-4xl bg-white border-[16px] border-primary/20 p-2 relative shadow-2xl print:shadow-none"
            style={{ aspectRatio: "1.414 / 1" }}
          >
            <div className="w-full h-full border-4 border-primary/40 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">

              {/* Decorative Corners */}
              <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-primary" />
              <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-primary" />
              <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-primary" />
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-primary" />

              {/* Header */}
              <h1 className="text-5xl font-black text-primary tracking-tighter mb-2">RAVP</h1>
              <h2 className="text-xl font-bold text-slate-600 uppercase tracking-[0.3em] mb-12">
                Rashtriya Annadata Vikas Party
              </h2>

              <h3 className="text-4xl font-serif text-slate-900 italic mb-10">Certificate of Membership</h3>

              <p className="text-lg text-slate-600 mb-4">This is to certify that</p>
              <h4 className="text-5xl font-bold text-slate-900 border-b-2 border-slate-300 pb-2 px-12 mb-8">
                {data.name}
              </h4>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed mb-12">
                is a registered{" "}
                <strong className="text-slate-900">{data.membershipType} Member</strong> of the
                Rashtriya Annadata Vikas Party (Member ID: {data.memberId}) and is committed to
                upholding the core values and vision of the organization.
              </p>

              {/* Signatures */}
              <div className="w-full flex justify-between px-16 mt-auto">
                <div className="text-center">
                  <div className="w-40 h-16 border-b border-slate-400 mb-2 flex items-end justify-center">
                    <img src="/sign.png" alt="National President Signature" className="h-14 object-contain" />
                  </div>
                  <p className="text-sm font-bold text-slate-900 uppercase">National President</p>
                </div>
                <div className="text-center">
                  <div className="w-40 h-16 border-b border-slate-400 mb-2 flex items-end justify-center pb-2">
                    <span className="font-bold text-slate-900">{data.issueDate}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 uppercase">Date of Issue</p>
                </div>
                <div className="text-center">
                  <div className="w-40 h-16 border-b border-slate-400 mb-2" />
                  <p className="text-sm font-bold text-slate-900 uppercase">General Secretary</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Print styles ─────────────────────────────────────────────────────────
          @page forces A4 landscape with zero margins.
          Everything on the page is hidden; only #cert-print-root is shown,
          stretched to fill the entire printed sheet.
      ──────────────────────────────────────────────────────────────────────────── */}
      <style>{`
        @media print {
          /* Force A4 landscape — this is the main fix */
          @page {
            size: A4 landscape;
            margin: 6mm;
          }

          /* Hide every element on the page … */
          body * {
            visibility: hidden !important;
          }

          /* … then reveal only the certificate and all its children */
          #cert-print-root,
          #cert-print-root * {
            visibility: visible !important;
          }

          /* Stretch the certificate to fill the full printed page */
          #cert-print-root {
            position: fixed !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            aspect-ratio: unset !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 4px !important;
          }

          /* Ensure colours (borders, backgrounds) print correctly */
          #cert-print-root,
          #cert-print-root * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
