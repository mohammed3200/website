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
        onClick={() => {}}
      >
        <div className="flex-1 gap-2">
          <div className="md:small-compact base-bold max-md:font-din-regular -mb-3 md:-mb-2">
            {index + 1 < 10 ? "0" : ""}
            {index + 1}{" "}.
          </div>
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value={index.toString()}>
                <AccordionTrigger className="font-din-bold text-sm md:text-base break-words">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="font-din-regular text-xs md:text-sm break-words">
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
