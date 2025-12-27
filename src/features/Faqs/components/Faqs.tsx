import useLanguage from "@/hooks/use-language";
import React from "react";
import { FaqItem } from "./FaqItem";
import { ListOfFaq } from "../types";

interface FaqProps {
  listOfFaq: ListOfFaq;
}

export const Faqs = ({ listOfFaq }: FaqProps) => {
  const { isArabic } = useLanguage();

  return (
    <div className="faq-container grid grid-cols-1 md:grid-cols-2 gap-8">
      {listOfFaq.map((item, index) => (
        <div key={index} className="faq-item relative z-10">
          <FaqItem
            item={
              isArabic
                ? {
                  question: item.question_ar,
                  answer: item.answer_ar,
                }
                : {
                  question: item.question_en,
                  answer: item.answer_en,
                }
            }
            index={index}
          />
        </div>
      ))}
    </div>
  );
};