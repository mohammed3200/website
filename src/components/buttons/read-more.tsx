'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadMoreProps {
  href: string;
  variant?: 'default' | 'button' | 'underline';
  className?: string;
  showArrow?: boolean;
}

export const ReadMore = ({
  href,
  variant = 'default',
  className,
  showArrow = true,
}: ReadMoreProps) => {
  const t = useTranslations('ui');
  const { isArabic } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    default:
      'text-primary hover:text-orange-700 font-din-regular inline-flex items-center gap-1 group',
    button:
      'inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-primary rounded-full font-din-bold text-sm hover:bg-orange-100 transition-colors',
    underline:
      "text-primary font-din-regular relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all",
  };

  return (
    <Link href={href} className={cn(variants[variant], className)}>
      <motion.span
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="flex items-center gap-2"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <span>{t('readMore')}</span>

        {showArrow && (
          <motion.span
            animate={{
              x: isHovered ? (isArabic ? -4 : 4) : 0,
              opacity: isHovered ? 1 : 0.6,
            }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {isArabic ? (
              <ArrowLeft className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </motion.span>
        )}
      </motion.span>
    </Link>
  );
};
