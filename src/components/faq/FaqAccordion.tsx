"use client";

import { useState } from "react";
import {
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Printer,
  Check,
  Sparkles,
  HelpCircle,
  Eye,
} from "lucide-react";

export interface FaqItemType {
  id: string;
  questionGu: string;
  questionEn: string;
  answerGu: string;
  answerEn: string;
  featured?: boolean;
  views?: number;
  helpfulCount?: number;
  notHelpfulCount?: number;
  category?: {
    nameGu: string;
    nameEn: string;
    slug: string;
  };
}

interface FaqAccordionProps {
  locale: string;
  faqs: FaqItemType[];
}

export function FaqAccordion({ locale, faqs }: FaqAccordionProps) {
  const isGu = locale === "gu";

  const [openId, setOpenId] = useState<string | null>(faqs.length > 0 ? faqs[0].id : null);
  const [votedMap, setVotedMap] = useState<Record<string, "helpful" | "not_helpful">>({});
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleAccordion = async (faqId: string) => {
    const isOpening = openId !== faqId;
    setOpenId(isOpening ? faqId : null);

    if (isOpening) {
      // Increment view count via API
      try {
        await fetch("/api/faq/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ faqId, incrementView: true }),
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleVote = async (faqId: string, vote: "helpful" | "not_helpful") => {
    if (votedMap[faqId]) return;

    setVotedMap((prev) => ({ ...prev, [faqId]: vote }));
    if (vote === "helpful") {
      setHelpfulCounts((prev) => ({ ...prev, [faqId]: (prev[faqId] || 0) + 1 }));
    }

    try {
      await fetch("/api/faq/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faqId, vote }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const copyFaqLink = (faqId: string) => {
    const url = `${window.location.origin}/${locale}/faq#faq-${faqId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(faqId);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const printFaq = (question: string, answer: string) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Rashtriya Annadata Vikas Party - FAQ Print</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; }
            h1 { color: #166534; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
            .question { font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #0f172a; }
            .answer { font-size: 15px; line-height: 1.6; color: #334155; }
            .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h1>Rashtriya Annadata Vikas Party (RAVP) - Official FAQ</h1>
          <div class="question">Q: ${question}</div>
          <div class="answer">A: ${answer}</div>
          <div class="footer">www.rashtriyaannadatavikasparty.org | Helpline: 9016641851</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (faqs.length === 0) {
    return (
      <div className="py-16 text-center text-slate-400 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
        <HelpCircle className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
        <h3 className="font-bold text-lg text-slate-700 dark:text-slate-300">
          {isGu ? "કોઈ પ્રશ્નો મળ્યા નથી" : "No matching questions found"}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {isGu
            ? "કૃપા કરીને અલગ કીવર્ડ અથવા શ્રેણી પસંદ કરીને પ્રયાસ કરો."
            : "Try searching with a different keyword or select another category."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, idx) => {
        const question = isGu ? faq.questionGu : faq.questionEn;
        const answer = isGu ? faq.answerGu : faq.answerEn;
        const isOpen = openId === faq.id;
        const categoryName = isGu ? faq.category?.nameGu : faq.category?.nameEn;

        const currentHelpful = (faq.helpfulCount || 0) + (helpfulCounts[faq.id] || 0);

        return (
          <div
            key={faq.id}
            id={`faq-${faq.id}`}
            className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? "bg-white dark:bg-slate-950 border-green-600/50 shadow-xl shadow-green-950/5 ring-1 ring-green-500/30"
                : "bg-white/80 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
            }`}
          >
            {/* Header Accordion Bar */}
            <button
              onClick={() => toggleAccordion(faq.id)}
              className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-black shrink-0 transition-transform group-hover:scale-110 ${
                  isOpen ? "bg-green-600 text-white" : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                }`}>
                  Q{idx + 1}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {faq.featured && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold uppercase">
                        <Sparkles className="w-3 h-3" />
                        <span>{isGu ? "મુખ્ય પ્રશ્ન" : "Featured"}</span>
                      </span>
                    )}

                    {categoryName && (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                        {categoryName}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors leading-snug">
                    {question}
                  </h3>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 group-hover:text-green-600 transition-colors shrink-0">
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-green-600" : ""
                  }`}
                />
              </div>
            </button>

            {/* Expandable Answer Content */}
            {isOpen && (
              <div className="px-5 sm:px-6 pb-6 pt-2 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-100 dark:border-slate-800/80 space-y-6 animate-fade-in">
                <p className="whitespace-pre-wrap">{answer}</p>

                {/* Footer Toolbar: Helpful Voting & Social Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-900 text-xs">
                  {/* Voting Buttons */}
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-bold">
                      {isGu ? "શું આ જવાબ મદદરૂપ હતો?" : "Was this answer helpful?"}
                    </span>

                    <button
                      onClick={() => handleVote(faq.id, "helpful")}
                      disabled={Boolean(votedMap[faq.id])}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                        votedMap[faq.id] === "helpful"
                          ? "bg-green-600 text-white"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-950/40"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{isGu ? "હા" : "Yes"} ({currentHelpful})</span>
                    </button>

                    <button
                      onClick={() => handleVote(faq.id, "not_helpful")}
                      disabled={Boolean(votedMap[faq.id])}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                        votedMap[faq.id] === "not_helpful"
                          ? "bg-rose-600 text-white"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{isGu ? "ના" : "No"}</span>
                    </button>
                  </div>

                  {/* Copy Link & Print */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyFaqLink(faq.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold transition-colors flex items-center gap-1.5"
                    >
                      {copiedId === faq.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copiedId === faq.id ? (isGu ? "કોપી થયું!" : "Copied!") : (isGu ? "લિંક કોપી કરો" : "Copy Link")}</span>
                    </button>

                    <button
                      onClick={() => printFaq(question, answer)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{isGu ? "પ્રિન્ટ કરો" : "Print"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
