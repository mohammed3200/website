import { getPageContent } from '@/features/page-content/server/route';
import IncubatorsClient from './components/incubators-client';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: 'Meta' });
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/incubators`;

  return {
    title: tMeta('incubators.title'),
    description: tMeta('incubators.description'),
    alternates: {
      canonical: url,
      languages: {
        ar: `${process.env.NEXT_PUBLIC_SITE_URL}/ar/incubators`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/incubators`,
        'x-default': url,
      },
    },
    openGraph: {
      title: tMeta('incubators.title'),
      description: tMeta('incubators.description'),
      url,
      locale: locale === 'ar' ? 'ar_LY' : 'en_US',
    },
  };
}

export default async function IncubatorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch page content using feature helper
  const content = await getPageContent('incubators');

  return <IncubatorsClient locale={locale} content={content} />;
}
