import React from 'react';
import { Hero } from './components';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: 'Meta' });
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/contact`;

  return {
    title: tMeta('contact.title'),
    description: tMeta('contact.description'),
    alternates: {
      canonical: url,
      languages: {
        ar: `${process.env.NEXT_PUBLIC_SITE_URL}/ar/contact`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/contact`,
        'x-default': url,
      },
    },
    openGraph: {
      title: tMeta('contact.title'),
      description: tMeta('contact.description'),
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