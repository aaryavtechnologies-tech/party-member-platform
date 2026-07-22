"use client";

import { ShieldCheck, HeartHandshake, Award, FileCheck } from "lucide-react";

interface FaqCommitmentProps {
  locale: string;
}

export function FaqCommitment({ locale }: FaqCommitmentProps) {
  const isGu = locale === "gu";

  const commitments = isGu
    ? [
        { icon: ShieldCheck, title: "સંપૂર્ણ પારદર્શિતા", desc: "દરેક નીતિ અને સભ્યપદ પ્રક્રિયામાં ૧૦૦% પારદર્શિતા." },
        { icon: HeartHandshake, title: "ઝડપી પ્રતિસાદ", desc: "નાગરિકોના પ્રશ્નો અને ફરિયાદોનું ઝડપી નિવારણ." },
        { icon: Award, title: "ખેડૂત હિત પ્રથમ", desc: "અન્નદાતાના અધિકારો અને સન્માન માટે નિષ્ઠાપૂર્વક સંકલ્પ." },
        { icon: FileCheck, title: "સાચી અને સ્પષ્ટ માહિતી", desc: "તમામ પક્ષીય પ્રવૃત્તિઓની સાચી માહિતી ઉપલબ્ધ." },
      ]
    : [
        { icon: ShieldCheck, title: "Complete Transparency", desc: "100% openness in all party rules & membership." },
        { icon: HeartHandshake, title: "Prompt Grievance Redressal", desc: "Quick responses to citizen queries & concerns." },
        { icon: Award, title: "Farmer Rights First", desc: "Unwavering commitment to farmer welfare." },
        { icon: FileCheck, title: "Accurate Information", desc: "Reliable and clear details across all initiatives." },
      ];

  return (
    <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-4 py-1.5 rounded-full inline-block mb-3">
            {isGu ? "અમારો કટિબદ્ધ સંકલ્પ" : "Our Solemn Resolution"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {isGu ? "અમારો સંકલ્પ" : "Our Commitment"}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {commitments.map((c, idx) => {
            const IconComp = c.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-3 shadow-lg shadow-slate-900/5 hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-green-600 text-white flex items-center justify-center shadow-md">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  {c.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
