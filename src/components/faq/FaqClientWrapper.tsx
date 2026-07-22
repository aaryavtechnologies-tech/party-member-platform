"use client";

import { useState, useMemo } from "react";
import { FaqHero } from "./FaqHero";
import { FaqIntro } from "./FaqIntro";
import { FaqSearch } from "./FaqSearch";
import { FaqCategories } from "./FaqCategories";
import { FaqAccordion, FaqItemType } from "./FaqAccordion";
import { FaqHelpfulCards } from "./FaqHelpfulCards";
import { FaqStillHaveQuestions } from "./FaqStillHaveQuestions";
import { FaqCommitment } from "./FaqCommitment";
import { FaqMotto } from "./FaqMotto";

interface FaqClientWrapperProps {
  locale: string;
  initialCategories: any[];
  initialFaqs: FaqItemType[];
}

export function FaqClientWrapper({
  locale,
  initialCategories,
  initialFaqs,
}: FaqClientWrapperProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Client-side instant filtering based on query & category
  const filteredFaqs = useMemo(() => {
    return initialFaqs.filter((faq) => {
      // Category Filter
      if (selectedCategory !== "all" && selectedCategory !== "ALL") {
        if (faq.category?.slug.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Search Query Filter
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const matchGu = faq.questionGu.toLowerCase().includes(query) || faq.answerGu.toLowerCase().includes(query);
        const matchEn = faq.questionEn.toLowerCase().includes(query) || faq.answerEn.toLowerCase().includes(query);
        const matchCat = faq.category?.nameEn.toLowerCase().includes(query) || faq.category?.nameGu.toLowerCase().includes(query);

        return matchGu || matchEn || matchCat;
      }

      return true;
    });
  }, [initialFaqs, searchTerm, selectedCategory]);

  return (
    <>
      {/* 1. Hero Section */}
      <FaqHero locale={locale} />

      {/* 2. Glass Introduction Card Section */}
      <FaqIntro locale={locale} />

      {/* 3. Live Search Bar Section */}
      <FaqSearch
        locale={locale}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* 4. Sticky FAQ Categories Section */}
      <FaqCategories
        locale={locale}
        categories={initialCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 5. FAQ Accordions List */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/40">
        <div className="container mx-auto px-4 max-w-4xl">
          <FaqAccordion locale={locale} faqs={filteredFaqs} />
        </div>
      </section>

      {/* 6. Helpful Information Portals Cards */}
      <FaqHelpfulCards locale={locale} />

      {/* 7. Still Have Questions Section */}
      <FaqStillHaveQuestions locale={locale} />

      {/* 8. Our Commitment Section ("અમારો સંકલ્પ") */}
      <FaqCommitment locale={locale} />

      {/* 9. Motto Banner Section */}
      <FaqMotto locale={locale} />
    </>
  );
}
