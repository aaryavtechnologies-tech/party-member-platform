"use client";

import { Building, MapPin, Phone, Mail, Globe, ExternalLink, Clock, CalendarDays } from "lucide-react";

interface ContactHeadquartersProps {
  locale: string;
  data?: {
    officeNameEn?: string;
    officeNameGu?: string;
    addressEn?: string;
    addressGu?: string;
    phone?: string;
    email?: string;
    website?: string;
    googleMapUrl?: string;
    workingHours?: Array<{
      dayRangeEn: string;
      dayRangeGu: string;
      timingEn: string;
      timingGu: string;
      isClosed?: boolean;
    }>;
  };
}

export function ContactHeadquarters({ locale, data }: ContactHeadquartersProps) {
  const isGu = locale === "gu";

  const officeName = isGu
    ? data?.officeNameGu || "રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી (RAVP)"
    : data?.officeNameEn || "Rashtriya Annadata Vikas Party (RAVP)";

  const address = isGu
    ? data?.addressGu || "૩૩૬ રોયલ કોમ્પ્લેક્સ, ભૂતખાના ચોક, ઢેબર રોડ, રાજકોટ – ૩૬૦૦૦૧, ગુજરાત, ભારત"
    : data?.addressEn || "336 Royal Complex, Bhutkhana Chowk, Dhebar Road, Rajkot – 360001, Gujarat, India";

  const phone = data?.phone || "9016641851";
  const email = data?.email || "info@rashtriyaannadatavikasparty.org";
  const website = data?.website || "www.rashtriyaannadatavikasparty.org";
  const mapUrl = data?.googleMapUrl || "https://maps.google.com/?q=Dhebar+Road+Rajkot+Gujarat";

  const defaultHours = [
    {
      dayRangeEn: "Monday – Saturday",
      dayRangeGu: "સોમવાર – શનિવાર",
      timingEn: "10:00 AM – 6:00 PM",
      timingGu: "સવારે 10:00 – સાંજે 6:00",
      isClosed: false,
    },
    {
      dayRangeEn: "Sunday",
      dayRangeGu: "રવિવાર",
      timingEn: "Closed",
      timingGu: "બંધ",
      isClosed: true,
    },
    {
      dayRangeEn: "Public Holidays",
      dayRangeGu: "જાહેર રજાઓ",
      timingEn: "Closed",
      timingGu: "બંધ",
      isClosed: true,
    },
  ];

  const workingHours = data?.workingHours && data.workingHours.length > 0 ? data.workingHours : defaultHours;

  return (
    <section id="headquarters-section" className="py-20 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Section 4: Headquarters Information (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3.5 py-1.5 rounded-full inline-block mb-3">
                {isGu ? "મુખ્ય કાર્યાલય" : "Central Headquarters"}
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {officeName}
              </h2>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 space-y-6 shadow-xl shadow-slate-900/5">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-green-600 text-white shrink-0 shadow-md">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">
                    {isGu ? "સરનામું" : "Office Address"}
                  </h3>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold text-base sm:text-lg leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 shrink-0 shadow-md">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">
                    {isGu ? "હેલ્પલાઇન નંબર" : "Phone & Helpline"}
                  </h3>
                  <a href={`tel:${phone}`} className="text-slate-900 dark:text-white font-bold text-lg hover:text-green-600 transition-colors">
                    +91 {phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-blue-600 text-white shrink-0 shadow-md">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">
                    {isGu ? "ઇમેઇલ" : "Email Address"}
                  </h3>
                  <a href={`mailto:${email}`} className="text-slate-900 dark:text-white font-bold text-base sm:text-lg hover:text-green-600 transition-colors break-all">
                    {email}
                  </a>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-purple-600 text-white shrink-0 shadow-md">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">
                    {isGu ? "સત્તાવાર વેબસાઇટ" : "Official Website"}
                  </h3>
                  <a href={`https://${website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-slate-900 dark:text-white font-bold text-base hover:text-green-600 transition-colors">
                    {website}
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-3 border-t border-slate-200 dark:border-slate-800">
                <a
                  href={`tel:${phone}`}
                  className="flex-1 min-w-[140px] px-5 py-3 rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-sm shadow-md text-center transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>{isGu ? "કૉલ કરો" : "Call Now"}</span>
                </a>

                <a
                  href={`mailto:${email}`}
                  className="flex-1 min-w-[140px] px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md text-center transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>{isGu ? "ઇમેઇલ મોકલો" : "Send Email"}</span>
                </a>

                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-w-[160px] px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md text-center transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{isGu ? "ગુગલ મેપ્સ ખોલો" : "Open Google Maps"}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Section 5: Working Hours (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/60 px-3.5 py-1.5 rounded-full inline-block mb-3">
                {isGu ? "સમયપત્રક" : "Operating Hours"}
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {isGu ? "કાર્યાલય સમય" : "Working Hours"}
              </h2>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-600/10 rounded-full blur-2xl" />

              <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-800">
                <div className="p-3 rounded-2xl bg-green-500/20 text-green-400 border border-green-500/30">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {isGu ? "મુખ્ય કચેરીકામ કલાકો" : "Official Public Schedule"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isGu ? "મુલાકાત લેતા પહેલા સમય ચકાસો" : "Central Office Hours in Rajkot"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {workingHours.map((wh, idx) => {
                  const dayRange = isGu ? wh.dayRangeGu : wh.dayRangeEn;
                  const timing = isGu ? wh.timingGu : wh.timingEn;

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border flex items-center justify-between ${
                        wh.isClosed
                          ? "bg-slate-950/60 border-slate-800 text-slate-400"
                          : "bg-green-950/40 border-green-800/50 text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CalendarDays className={`w-5 h-5 ${wh.isClosed ? "text-slate-500" : "text-amber-400"}`} />
                        <span className="font-bold text-sm sm:text-base">{dayRange}</span>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                        wh.isClosed
                          ? "bg-rose-950/80 text-rose-300 border border-rose-800/50"
                          : "bg-green-500/20 text-green-300 border border-green-500/40"
                      }`}>
                        {timing}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                ℹ️ {isGu
                  ? "જાહેર રજાઓ તથા ઈમરજન્સી સમયે ઑનલાઇન સંપર્ક ફોર્મ દ્વારા રજૂઆત કરી શકો છો."
                  : "On Sundays and Public Holidays, please use our online contact form for emergency grievances."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
