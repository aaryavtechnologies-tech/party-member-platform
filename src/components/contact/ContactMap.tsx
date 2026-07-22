"use client";

import { MapPin, ExternalLink, Navigation, Maximize2 } from "lucide-react";

interface ContactMapProps {
  locale: string;
  embedUrl?: string;
  mapUrl?: string;
}

export function ContactMap({ locale, embedUrl, mapUrl }: ContactMapProps) {
  const isGu = locale === "gu";

  const defaultEmbed =
    embedUrl ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.688137351659!2d70.8005391!3d22.2907481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959ca086a982dfb%3A0x63ebc980fb5c5f4!2sDhebar%20Rd%2C%20Rajkot%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

  const directMap = mapUrl || "https://maps.google.com/?q=Dhebar+Road+Rajkot+Gujarat";

  return (
    <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3.5 py-1.5 rounded-full inline-block mb-3">
              {isGu ? "સ્થાન દર્શન" : "Interactive Location"}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {isGu ? "ગુગલ મેપ સ્થાનાંક" : "Headquarters Location Map"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={directMap}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>{isGu ? "દિશા-નિર્દેશ (Directions)" : "Get Directions"}</span>
            </a>

            <a
              href={directMap}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4 text-amber-500" />
              <span>{isGu ? "મોટા મેપમાં ખોલો" : "Open in Google Maps"}</span>
            </a>
          </div>
        </div>

        {/* Map Frame Container */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl h-[420px] bg-slate-100 dark:bg-slate-900">
          <iframe
            src={defaultEmbed}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="RAVP Headquarters Rajkot Location"
            className="w-full h-full filter contrast-105"
          />

          {/* Map Overlay Badge */}
          <div className="absolute bottom-6 left-6 bg-slate-950/90 text-white p-4 rounded-2xl border border-slate-800 backdrop-blur-md max-w-sm hidden sm:block shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0">
                RV
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Rashtriya Annadata Vikas Party</h4>
                <p className="text-xs text-slate-300 truncate">336 Royal Complex, Dhebar Road, Rajkot</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
