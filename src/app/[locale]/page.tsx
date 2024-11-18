"use client";

import useIsArabic from '@/hooks/useIsArabic';
import {useTranslations} from 'next-intl';
 
export default function HomePage() {
  const isArabic = useIsArabic();
  const t = useTranslations('HomePage');
  
  return (
    <div dir={isArabic ? 'rtl' : 'ltr'}>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}