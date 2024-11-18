"use client";

import { useEffect, useState } from 'react';
import useLanguage from './uselanguage';

const useIsArabic = () => {
  const lang = useLanguage();
  const [isArabic, setIsArabic] = useState(false);

  useEffect(() => {

    // Check if the path starts with '/ar'
    setIsArabic(lang == 'ar');
  }, [lang]);

  return isArabic;
};

export default useIsArabic;