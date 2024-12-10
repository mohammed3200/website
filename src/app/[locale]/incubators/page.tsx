"use client";

import React from 'react';

import useLanguage from '@/hooks/uselanguage';

import { Hero } from './components';

const Page = () => {
    const { isArabic } = useLanguage();

    return (
      <section dir={isArabic ? "rtl" : "ltr"}>
        <Hero  />
      </section>
    );
};

export default Page;