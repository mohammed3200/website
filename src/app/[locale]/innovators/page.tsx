"use client";

import React from 'react';

import useLanguage from '@/hooks/use-language';

import { Hero } from '@/features/innovators/components';

const Page = () => {
  const { isArabic } = useLanguage();

  return (
    <section dir={isArabic ? "rtl" : "ltr"}>
      <Hero />
    </section>
  );
};

export default Page;