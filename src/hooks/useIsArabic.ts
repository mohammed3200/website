"use client";

import { useEffect, useState } from 'react';

const useIsArabic = () => {
  const [isArabic, setIsArabic] = useState(false);

  useEffect(() => {
    // Get the current path from the window location
    const path = window.location.pathname;

    // Check if the path starts with '/ar'
    setIsArabic(path.startsWith('/ar'));
  }, []);

  return isArabic;
};

export default useIsArabic;