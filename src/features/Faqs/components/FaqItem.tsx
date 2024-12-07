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
    <div className="relative z-[2] mb-16">
      <div
        className="group relative flex cursor-pointer items-center justify-between gap-10 px-7"
        onClick={() => {}}
      >
        <div className="flex-1 gap-2">
          <div className="small-compact -mb-2 text-p3 max-lg:hidden">
            {index + 1 < 10 ? "0" : ""}
            {index + 1}
          </div>
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
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
