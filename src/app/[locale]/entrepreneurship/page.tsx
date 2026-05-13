import { getPageContent } from '@/features/page-content/server/route';
import EntrepreneurshipClient from './components/entrepreneurship-client';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: 'Meta' });
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/entrepreneurship`;

  return {
    title: tMeta('entrepreneurship.title'),
    description: tMeta('entrepreneurship.description'),
    alternates: {
      canonical: url,
      languages: {
        ar: `${process.env.NEXT_PUBLIC_SITE_URL}/ar/entrepreneurship`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/entrepreneurship`,
        'x-default': url,
      },
    },
    openGraph: {
      title: tMeta('entrepreneurship.title'),
      description: tMeta('entrepreneurship.description'),
      url,
      locale: locale === 'ar' ? 'ar_LY' : 'en_US',
    },
  };
}

export default async function EntrepreneurshipPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch page content using feature helper
  const content = await getPageContent('entrepreneurship');

  return <EntrepreneurshipClient locale={locale} content={content} />;
}
