'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import useLanguage from '@/hooks/use-language';
import { Loader2 } from 'lucide-react';

type ActiveButtonProps = {
  children: React.ReactNode;
  onClick: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  containerClassName?: string;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
} & React.ComponentProps<typeof motion.button>;

export const ActiveButton = ({
  children,
  onClick,
  className,
  containerClassName,
  icon,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  ...props
}: ActiveButtonProps) => {
  const { isArabic } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    primary:
      'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40',
    secondary:
      'bg-white text-gray-900 border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50/30',
    outline:
      'bg-transparent text-orange-600 border-2 border-orange-500 hover:bg-orange-50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={disabled || loading ? {} : { scale: 1.03, y: -2 }}
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      className={cn(
        'relative group isolate overflow-hidden rounded-full',
        'flex items-center justify-center gap-3',
        'transition-all duration-300 ease-out',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none',
        variants[variant],
        sizes[size],
        isArabic ? 'flex-row' : 'flex-row-reverse',
        className,
      )}
      {...props}
    >
      {/* Animated Background Gradient */}
      <AnimatePresence>
        {isHovered && variant === 'primary' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-700 -z-10"
          />
        )}
      </AnimatePresence>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Loading State */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Loader2 className="w-5 h-5 animate-spin" />
          </motion.div>
        ) : (
          <>
            {/* Button Content */}
            <motion.div
              className={cn(
                'font-din-bold whitespace-nowrap',
                containerClassName,
              )}
              animate={{ x: isHovered ? (isArabic ? -2 : 2) : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {children}
            </motion.div>

            {/* Icon with enhanced animation */}
            {icon && (
              <motion.div
                className="relative size-5 shrink-0"
                animate={{
                  rotate: isHovered ? 15 : 0,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Image
                  src={icon}
                  alt="icon"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Ripple Effect on Click */}
      <motion.span
        className="absolute inset-0 rounded-full bg-white/30 pointer-events-none"
        initial={{ scale: 0, opacity: 0.4 }}
        whileTap={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  );
};
