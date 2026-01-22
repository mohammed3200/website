"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FaqItemProps {
  item: { question: string; answer: string };
  index: number;
  isOpen: boolean;
  toggle: () => void;
}

export const FaqItem = ({ item, index, isOpen, toggle }: FaqItemProps) => {
  return (
    <div
      className={cn(
        "group bg-white rounded-2xl border transition-all duration-300 overflow-hidden",
        isOpen ? "border-primary shadow-lg shadow-primary/5" : "border-gray-100 hover:border-primary/30"
      )}
    >
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <div className="flex items-center gap-5">
          {/* Number Badge */}
          <span className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold font-mono transition-colors",
            isOpen ? "bg-primary text-white" : "bg-gray-50 text-gray-400 group-hover:text-primary"
          )}>
            {(index + 1).toString().padStart(2, '0')}
          </span>

          <span className={cn(
            "text-lg md:text-xl font-bold font-almarai transition-colors",
            isOpen ? "text-primary" : "text-foreground group-hover:text-primary"
          )}>
            {item.question}
          </span>
        </div>

        <div className={cn(
          "p-2 rounded-full transition-colors shrink-0 ml-4",
          isOpen ? "bg-primary/10 text-primary" : "bg-gray-50 text-gray-400 group-hover:text-primary"
        )}>
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pl-[5.5rem] md:pl-[5.5rem]">
              <p className="text-gray-600 font-outfit text-base leading-relaxed">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
