"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import QRCode from "react-qr-code";

interface CardData {
  name: string;
  fatherName: string;
  dob: string;
  mobile: string;
  address: string;
  memberId: string;
  photoUrl: string | null | undefined;
  issueDate: string;
  location: string;
  membershipType: string;
}

/** Convert an external image URL to a base64 data URI so html2canvas can render it without CORS issues */
async function toDataUri(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return url; // Fall back to the original URL
  }
}

export default function DigitalCardClient({ data }: { data: CardData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  // Store base64-encoded photo so html2canvas can render it without CORS issues
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);

  useEffect(() => {
    if (data.photoUrl) {
      toDataUri(data.photoUrl).then(setPhotoDataUri);
    }
  }, [data.photoUrl]);

  const downloadCard = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const { toast } = await import("sonner");
      toast.info("Generating ID Card...");
      
      // Fix for html2canvas scrolling bug
      window.scrollTo(0, 0);
      
      const html2canvas = (await import("html2canvas")).default;
      if (cardRef.current) {
        const canvas = await html2canvas(cardRef.current, { 
          scale: 3, 
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: null
        });
        const link = document.createElement("a");
        link.download = `RAVP_ID_${data.memberId}.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("ID Card downloaded successfully!");
      }
    } catch (error) {
      console.error("Failed to generate ID card image", error);
      const { toast } = await import("sonner");
      toast.error("Failed to download ID card. Please try again.");
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
        </div>
      </div>

      <div className="flex justify-center items-center py-10 print:py-0 print:block overflow-x-auto">
        {/* Card Container for html2canvas (Contains both Front & Back) */}
        <div ref={cardRef} className="flex flex-col gap-8 print:gap-8 bg-transparent">
          
          {/* ================= FRONT SIDE ================= */}
          <div 
            className="relative w-[480px] min-w-[480px] rounded-xl overflow-hidden bg-white shadow-2xl shadow-slate-900/10 border-2 border-slate-300 print:shadow-none print:border-black"
            style={{ aspectRatio: "85/54" }} 
          >
            {/* Header */}
            <div className="h-14 bg-gradient-to-r from-orange-500 via-white to-green-500 flex items-center justify-center border-b-2 border-orange-600 relative">
              <div className="absolute left-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden border border-slate-200 p-0.5">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-full" crossOrigin="anonymous" />
              </div>
              <div className="bg-white px-3 py-1 rounded-full shadow-sm ml-8">
                <h2 className="font-black text-[17px] text-orange-600 tracking-tight text-center uppercase whitespace-nowrap">Rashtriya Annadata Vikas Party</h2>
              </div>
            </div>

            <div className="p-4 flex gap-4 h-[calc(100%-3.5rem)] relative">
              {/* Left Column: Photo & QR */}
              <div className="flex flex-col w-[110px] items-center shrink-0">
                <div className="w-[100px] h-[120px] bg-slate-100 border border-slate-300 shadow-sm overflow-hidden flex items-center justify-center mb-3 rounded bg-white shrink-0">
                  {(photoDataUri || data.photoUrl) ? (
                    // Use the base64 data URI when available (required for html2canvas)
                    <img src={photoDataUri ?? data.photoUrl ?? undefined} alt="Photo" className="w-full h-full object-cover" crossOrigin="anonymous" />
                  ) : (
                    <span className="text-slate-400 font-bold text-3xl">{data.name.charAt(0)}</span>
                  )}
                </div>
                
                {/* QR Code and Issue Date */}
                <div className="w-full flex flex-col items-center justify-center gap-1.5">
                  <div className="w-[50px] h-[50px] bg-white p-1 rounded border border-slate-200 shadow-sm">
                    <QRCode value={`https://party.com/verify/member/${data.memberId}`} size={40} />
                  </div>
                  <div className="text-center">
                    <p className="text-[7px] text-slate-500 font-bold uppercase leading-none mb-0.5">Issue Date</p>
                    <p className="font-bold text-slate-900 text-[10px] leading-none">{data.issueDate}</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase leading-none">Member Name</p>
                      <p className="font-bold text-slate-900 text-sm leading-tight">{data.name}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase leading-none">Father/Husband's Name</p>
                    <p className="font-bold text-slate-900 text-sm leading-tight">{data.fatherName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase leading-none">DOB</p>
                      <p className="font-bold text-slate-900 text-sm leading-tight">{data.dob}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase leading-none">Mobile</p>
                      <p className="font-bold text-slate-900 text-sm leading-tight">{data.mobile}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase leading-none">Address</p>
                    <p className="font-semibold text-slate-800 text-[11px] leading-tight line-clamp-2 max-w-[200px]">{data.address}</p>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="flex justify-end items-end mt-2 pt-2 border-t border-slate-200">
                  <div className="flex flex-col items-center">
                    <div className="h-8 mb-0.5">
                      <img src="/sign.png" alt="Signature" className="h-full object-contain" />
                    </div>
                    <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tight leading-none">Issuing Authority</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= BACK SIDE ================= */}
          <div 
            className="relative w-[480px] min-w-[480px] rounded-xl overflow-hidden bg-white shadow-2xl shadow-slate-900/10 border-2 border-slate-300 print:shadow-none print:border-black"
            style={{ aspectRatio: "85/54" }} 
          >
            {/* Header */}
            <div className="h-10 bg-slate-800 flex items-center justify-center border-b-2 border-orange-600">
              <h2 className="font-bold text-sm text-white tracking-widest text-center uppercase">Terms & Conditions / નિયમો અને શરતો</h2>
            </div>

            <div className="p-5 flex flex-col justify-between h-[calc(100%-2.5rem)] relative">
              
              <div className="flex justify-center mb-4">
                <div className="bg-orange-50 px-4 py-1.5 rounded-md border border-orange-200 shadow-sm text-center inline-block">
                  <p className="text-[10px] text-slate-500 font-bold uppercase leading-none mb-1">Member ID</p>
                  <p className="font-black text-orange-600 text-lg leading-tight tracking-wider">{data.memberId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* English Rules */}
                <div>
                  <h3 className="text-orange-600 font-black text-xs uppercase mb-2 border-b border-orange-200 pb-1">English</h3>
                  <ul className="text-[10px] text-slate-700 font-semibold space-y-1.5 list-disc pl-3">
                    <li>This card is non-transferable and remains the property of RAVP.</li>
                    <li>If found, please return to the nearest RAVP office.</li>
                  </ul>
                </div>

                {/* Gujarati Rules */}
                <div>
                  <h3 className="text-green-600 font-black text-xs uppercase mb-2 border-b border-green-200 pb-1">ગુજરાતી</h3>
                  <ul className="text-[10px] text-slate-700 font-semibold space-y-1.5 list-disc pl-3">
                    <li>આ કાર્ડ અન્ય કોઈને આપી શકાશે નહીં અને તે RAVP ની મિલકત છે.</li>
                    <li>જો આ કાર્ડ મળે, તો કૃપા કરીને નજીકના RAVP કાર્યાલય પર પરત કરો.</li>
                  </ul>
                </div>
              </div>

              {/* Back Footer / Return Address */}
              <div className="mt-4 pt-3 border-t border-slate-200 text-center">
                <p className="text-[9px] text-slate-500 font-bold uppercase mb-0.5 tracking-wider">If found, please return to:</p>
                <p className="font-black text-slate-900 text-xs uppercase">Rashtriya Annadata Vikas Party Office</p>
                <p className="font-semibold text-slate-700 text-[10px] mt-0.5">Gujarat, India - Website: www.ravp.org</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
