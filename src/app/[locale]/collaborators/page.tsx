import React from 'react';
import { Hero } from '@/features/collaborators/components';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: 'Meta' });
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/collaborators`;

  return {
    title: tMeta('collaborators.title'),
    description: tMeta('collaborators.description'),
    alternates: {
      canonical: url,
      languages: {
        ar: `${process.env.NEXT_PUBLIC_SITE_URL}/ar/collaborators`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/collaborators`,
        'x-default': url,
      },
    },
    openGraph: {
      title: tMeta('collaborators.title'),
      description: tMeta('collaborators.description'),
      url,
      locale: locale === 'ar' ? 'ar_LY' : 'en_US',
    },
  };
}

const Page = () => {
  return (
    <section>
      <Hero />
    </section>
  );
};

export default Page;