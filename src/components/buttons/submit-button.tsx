'use client';

import React from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import useLanguage from '@/hooks/use-language';

type SubmitButtonProps = {
    className?: string;
    classNameContent?: string;
    children: React.ReactNode;
    isLoading: boolean;
} & React.ComponentProps<typeof motion.button>;

export const SubmitButton: React.FC<SubmitButtonProps> = ({
    classNameContent,
    className,
    children,
    isLoading,
    disabled,
    ...props
}) => {
    const { isArabic } = useLanguage();

    return (
        <motion.button
            type="submit"
            disabled={isLoading || disabled}
            whileHover={isLoading || disabled ? {} : { scale: 1.02 }}
            whileTap={isLoading || disabled ? {} : { scale: 0.98 }}
            className={cn(
                'group relative overflow-hidden rounded-full',
                'bg-gradient-to-r from-orange-400 to-orange-600',
                'text-white font-din-bold text-base',
                'shadow-lg shadow-orange-500/25',
                'transition-all duration-300',
                'hover:shadow-orange-500/40 hover:brightness-105',
                'disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none',
                'px-8 py-3.5',
                'min-w-[160px]', // Ensure button has substantial width
                className
            )}
            {...props}
        >
            {/* Glossy Overlay for premium feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className={cn(
                'relative flex items-center justify-center gap-3',
                isArabic ? 'flex-row' : 'flex-row', // Keep logical order, handled by dir="rtl" usually
                classNameContent
            )}>
                <span className="relative z-10 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.span
                                key="loading"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {isArabic ? 'جاري الإرسال...' : 'Sending...'}
                            </motion.span>
                        ) : (
                            <motion.span
                                key="text"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {children}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </span>

                {/* Dynamic Icon */}
                <div className="relative size-5 flex items-center justify-center">
                    {isLoading ? (
                        <Loader2 className="animate-spin size-5 text-white/90" />
                    ) : (
                        <motion.div
                            animate={{
                                x: 0,
                                y: 0,
                                scale: 1,
                                rotate: 0,
                            }}
                            whileHover={{
                                rotate: -15, // Tilt plane slightly
                                scale: 1.1
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <Send className={cn(
                                "size-5 text-white",
                                isArabic && "-scale-x-100" // Flip icon for Arabic
                            )} />
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.button>
    );
};