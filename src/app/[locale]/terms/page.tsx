import { LegalContentViewer } from '@/features/legal-content';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: 'Meta' });
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/terms`;

  return {
    title: tMeta('terms.title'),
    description: tMeta('terms.description'),
    alternates: {
      canonical: url,
      languages: {
        ar: `${process.env.NEXT_PUBLIC_SITE_URL}/ar/terms`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/terms`,
        'x-default': url,
      },
    },
    openGraph: {
      title: tMeta('terms.title'),
      description: tMeta('terms.description'),
      url,
      locale: locale === 'ar' ? 'ar_LY' : 'en_US',
    },
  };
}
interface TermsPageProps {
    params: Promise<{ locale: string }>;
}

export default async function TermsPage({ params }: TermsPageProps) {
    const { locale } = await params;
    const safeLocale = locale === 'ar' ? 'ar' : 'en';

    return <LegalContentViewer type="terms" locale={safeLocale} />;
}
