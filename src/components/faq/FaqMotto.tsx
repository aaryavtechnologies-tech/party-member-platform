"use client";

interface FaqMottoProps {
  locale: string;
}

export function FaqMotto({ locale }: FaqMottoProps) {
  const isGu = locale === "gu";

  return (
    <section className="py-16 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 text-center relative overflow-hidden shadow-inner">
      <div className="container mx-auto px-4 max-w-5xl relative z-10 space-y-3">
        <span className="text-xs font-black uppercase tracking-widest px-3.5 py-1 rounded-full bg-slate-950 text-amber-400 inline-block shadow">
          {isGu ? "પક્ષ સંકલ્પ વાક્ય" : "RAVP FAQ Motto"}
        </span>

        <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 leading-tight">
          {isGu
            ? "\"સાચી માહિતી • સરળ જવાબ • મજબૂત વિશ્વાસ\""
            : "\"Accurate Info • Simple Answers • Strong Trust\""}
        </h2>

        <p className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-wide max-w-3xl mx-auto">
          {isGu
            ? "\"આપનો પ્રશ્ન, અમારો જવાબ – જનસેવા માટે હંમેશા તૈયાર.\""
            : "\"Your Question, Our Answer – Always Ready for Public Service.\""}
        </p>
      </div>
    </section>
  );
}
