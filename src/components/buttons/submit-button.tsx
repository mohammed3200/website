'use client';

import React, { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import useLanguage from '@/hooks/use-language';

type SubmitButtonProps = {
  className?: string;
  classNameContent?: string;
  children: React.ReactNode;
  isLoading: boolean;
  isSuccess?: boolean;
  successMessage?: string;
} & React.ComponentProps<typeof motion.button>;

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  classNameContent,
  className,
  children,
  isLoading,
  isSuccess = false,
  successMessage,
  disabled,
  ...props
}) => {
  const { isArabic } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      type="submit"
      disabled={isLoading || disabled || isSuccess}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={
        isLoading || disabled || isSuccess ? {} : { scale: 1.02, y: -2 }
      }
      whileTap={isLoading || disabled || isSuccess ? {} : { scale: 0.98 }}
      className={cn(
        'group relative overflow-hidden rounded-full',
        'bg-gradient-to-r from-orange-400 to-orange-600',
        'text-white font-din-bold text-base',
        'shadow-lg shadow-orange-500/25',
        'transition-all duration-300',
        'hover:shadow-orange-500/40 hover:shadow-xl',
        'disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none',
        'px-8 py-4 min-w-[180px]',
        isSuccess &&
          'bg-gradient-to-r from-green-500 to-green-600 shadow-green-500/25',
        className,
      )}
      {...props}
    >
      {/* Success Pulse Effect */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 bg-green-400 rounded-full"
          />
        )}
      </AnimatePresence>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Content Container */}
      <div
        className={cn(
          'relative flex items-center justify-center gap-3',
          isArabic ? 'flex-row' : 'flex-row-reverse',
          classNameContent,
        )}
      >
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.span
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              {successMessage || (isArabic ? 'تم الإرسال!' : 'Sent!')}
            </motion.span>
          ) : isLoading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              {isArabic ? 'جاري الإرسال...' : 'Sending...'}
            </motion.span>
          ) : (
            <motion.span
              key="text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              {children}
              <motion.div
                animate={{
                  x: isHovered ? (isArabic ? -3 : 3) : 0,
                  rotate: isHovered ? -15 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Send className={cn('w-5 h-5', isArabic && '-scale-x-100')} />
              </motion.div>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Gradient Line Animation */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isLoading ? [0, 1, 0] : 0 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: isArabic ? 'right' : 'left' }}
      />
    </motion.button>
  );
};
