"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import useIsArabic from '@/hooks/useIsArabic';

export const Footer = () => {
    const isArabic = useIsArabic();
    const t = useTranslations("Footer");

    return (
        <div className='footer' dir={isArabic ? "rtl" : "ltr"}>
            <div>
                <p className="font-din-regular lg:text-lg text-white">{t("copyright")}</p>
            </div>
        </div>
    );
};
