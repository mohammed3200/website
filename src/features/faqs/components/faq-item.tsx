import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItemProps {
  item: {
    question: string;
    answer: string;
  };
  index: number;
}

export const FaqItem = ({ item, index }: FaqItemProps) => {
  return (
    <div className="relative z-[2]">
      <div
        className="group relative flex cursor-pointer items-center justify-between gap-10 px-7"
        onClick={() => { }}
      >
        <div className="flex w-full items-start gap-4 md:gap-6">
          <div className="flex items-center justify-center size-10 md:size-12 rounded-full bg-primary/10 text-primary font-din-bold text-lg md:text-xl shrink-0 mt-2">
            {index + 1 < 10 ? "0" : ""}
            {index + 1}
          </div>
          <div className="flex-1">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={index.toString()} className="border-b-0">
                <AccordionTrigger className="font-din-bold text-lg md:text-xl text-left hover:no-underline hover:text-primary transition-colors py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="font-din-regular text-base md:text-lg text-gray-600 leading-relaxed pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};
