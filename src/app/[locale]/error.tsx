'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import useLanguage from '@/hooks/use-language';
import { useTranslations } from 'next-intl';

interface ErrorProps {
  _error: Error & { digest?: string };
  reset: () => void;
}

const Error = ({ _error, reset }: ErrorProps) => {
  const { isArabic } = useLanguage();
  const t = useTranslations('Error');

  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center bg-background"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold font-almarai text-foreground mb-3">
        {t('title')}
      </h2>

      <p className="text-gray-500 font-outfit max-w-sm mb-8">{t('message')}</p>

      <button
        onClick={() => {
          // Try to reset the error boundary
          reset();
          // Fallback to reload if needed, but reset is preferred in Next.js
          // window.location.reload()
        }}
        className="px-6 py-3 bg-white border border-gray-200 text-foreground font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 shadow-sm"
      >
        <RefreshCw className="w-4 h-4" />
        {t('tryAgain')}
      </button>
    </div>
  );
};

export default Error;
