"use client";

import { useState } from 'react';
import useLanguage from '@/hooks/use-language';
import { FaqItem } from './faq-item';
import { ListOfFaq } from '@/features/faqs/types';

interface FaqProps {
  listOfFaq: ListOfFaq;
}

export const Faqs = ({ listOfFaq }: FaqProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { isArabic } = useLanguage();

  return (
    <div className="grid grid-cols-1 gap-6">
      {listOfFaq.map((item, index) => (
        <FaqItem
          key={index}
          index={index}
          isOpen={openIndex === index}
          toggle={() => setOpenIndex(openIndex === index ? null : index)}
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
        />
      ))}
    </div>
  );
};
