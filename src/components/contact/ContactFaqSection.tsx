"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItemData {
  id?: string;
  questionEn: string;
  questionGu: string;
  answerEn: string;
  answerGu: string;
}

interface ContactFaqSectionProps {
  locale: string;
  faqs?: FaqItemData[];
}

export function ContactFaqSection({ locale, faqs }: ContactFaqSectionProps) {
  const isGu = locale === "gu";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const defaultFaqs: FaqItemData[] = [
    {
      questionEn: "How can I become a member?",
      questionGu: "હું સભ્ય કેવી રીતે બની શકું?",
      answerEn: "You can click on the 'Become a Member' button at the top of the page, fill in your personal details, select your tier, and complete instant registration online.",
      answerGu: "તમે પૃષ્ઠના ઉપરના ભાગમાં 'સભ્ય બનો' બટન પર ક્લિક કરી શકો છો, તમારી વિગતો ભરી શકો છો અને ઓનલાઇન નોંધણી પૂર્ણ કરી શકો છો.",
    },
    {
      questionEn: "How do I upgrade my membership?",
      questionGu: "હું મારી સભ્યપદ કેવી રીતે અપગ્રેડ કરું?",
      answerEn: "Log in to your member portal and navigate to the Membership Upgrade section to select Lifetime Primary or Active status.",
      answerGu: "તમારા સભ્ય પોર્ટલમાં લૉગ ઇન કરો અને આજીવન પ્રાથમિક અથવા સક્રિય સભ્યપદ પસંદ કરવા માટે 'અપગ્રેડ' વિભાગ પર જાઓ.",
    },
    {
      questionEn: "Where is the headquarters?",
      questionGu: "પક્ષનું મુખ્ય કાર્યાલય ક્યાં આવેલું છે?",
      answerEn: "RAVP Headquarters is located at 336 Royal Complex, Bhutkhana Chowk, Dhebar Road, Rajkot – 360001, Gujarat, India.",
      answerGu: "RAVP મુખ્ય કાર્યાલય ૩૩૬ રોયલ કોમ્પ્લેક્સ, ભૂતખાના ચોક, ઢેબર રોડ, રાજકોટ – ૩૬૦૦૦૧, ગુજરાત, ભારતમાં આવેલું છે.",
    },
    {
      questionEn: "How do I contact the District Team?",
      questionGu: "જિલ્લા ટીમનો સંપર્ક કેવી રીતે કરવો?",
      answerEn: "Visit our Organization section in the main menu or use the contact form above to get connected with your respective district office bearer.",
      answerGu: "જિલ્લા હોદ્દેદારોની વિગતો અને સંપર્ક માહિતી જોવા માટે મુખ્ય મેનૂમાં સંગઠન વિભાગની મુલાકાત લો.",
    },
    {
      questionEn: "How can I submit a complaint?",
      questionGu: "હું ફરિયાદ ક્યાં દાખલ કરી શકું?",
      answerEn: "Fill out the online contact form on this page with the subject 'Grievance / Complaint' or visit our headquarters office directly.",
      answerGu: "આ પૃષ્ઠ પર 'ફરિયાદ / રજૂઆત' વિષય સાથે ઑનલાઇન સંપર્ક ફોર્મ ભરો અથવા સીધા અમારા કાર્યાલયની મુલાકાત લો.",
    },
    {
      questionEn: "How can I volunteer?",
      questionGu: "હું સ્વયંસેવક તરીકે કેવી રીતે જોડાઈ શકું?",
      answerEn: "Click on 'Volunteer Registration' in our services section or select 'Volunteer Interest' in the contact form subject dropdown.",
      answerGu: "અમારી સેવાઓ વિભાગમાં 'સ્વયંસેવક નોંધણી' પર ક્લિક કરો અથવા સંપર્ક ફોર્મમાં 'સ્વયંસેવક બનવાની ઈચ્છા' વિષય પસંદ કરો.",
    },
    {
      questionEn: "How do I contact the media department?",
      questionGu: "મીડિયા વિભાગનો સંપર્ક કેવી રીતે કરવો?",
      answerEn: "Send an email to info@rashtriyaannadatavikasparty.org with subject 'Media Query' or call our central helpline 9016641851.",
      answerGu: "'મીડિયા પૂછપરછ' વિષય સાથે info@rashtriyaannadatavikasparty.org પર ઇમેઇલ મોકલો અથવા 9016641851 પર કૉલ કરો.",
    },
  ];

  const items = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {isGu ? "વાંરવાર પૂછાતા પ્રશ્નો (FAQ)" : "Frequently Asked Questions"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {isGu
              ? "સંપર્ક, સભ્યપદ અને પક્ષ પ્રવૃત્તિઓ અંગેના સામાન્ય પ્રશ્નોના જવાબો મેળવો."
              : "Find quick answers to common questions about membership, offices, and grievances."}
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {items.map((item, idx) => {
            const question = isGu ? item.questionGu : item.questionEn;
            const answer = isGu ? item.answerGu : item.answerEn;
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-base sm:text-lg hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 font-black text-xs flex items-center justify-center shrink-0">
                      Q{idx + 1}
                    </span>
                    <span>{question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180 text-green-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-200/50 dark:border-slate-800/50">
                    {answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
