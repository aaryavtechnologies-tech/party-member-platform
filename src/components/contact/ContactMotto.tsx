"use client";

interface ContactMottoProps {
  locale: string;
  data?: {
    textEnLine1?: string;
    textEnLine2?: string;
    textGuLine1?: string;
    textGuLine2?: string;
  };
}

export function ContactMotto({ locale, data }: ContactMottoProps) {
  const isGu = locale === "gu";

  const line1 = isGu
    ? data?.textGuLine1 || "આપનો અવાજ, અમારો વિશ્વાસ."
    : data?.textEnLine1 || "Your Voice, Our Trust.";

  const line2 = isGu
    ? data?.textGuLine2 || "જનસંપર્કથી જનવિશ્વાસ, જનવિશ્વાસથી સમૃદ્ધ ભારત."
    : data?.textEnLine2 || "Public Connection Creates Public Trust.";

  return (
    <section className="py-16 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 text-center relative overflow-hidden shadow-inner">
      <div className="container mx-auto px-4 max-w-5xl relative z-10 space-y-3">
        <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-950 text-amber-400 inline-block shadow">
          {isGu ? "પક્ષ ધ્યેય વાક્ય" : "Party Motto"}
        </span>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 leading-tight">
          {line1}
        </h2>

        <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-wide max-w-3xl mx-auto">
          {line2}
        </p>
      </div>
    </section>
  );
}
