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
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/privacy`;

  return {
    title: tMeta('privacy.title'),
    description: tMeta('privacy.description'),
    alternates: {
      canonical: url,
      languages: {
        ar: `${process.env.NEXT_PUBLIC_SITE_URL}/ar/privacy`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/privacy`,
        'x-default': url,
      },
    },
    openGraph: {
      title: tMeta('privacy.title'),
      description: tMeta('privacy.description'),
      url,
      locale: locale === 'ar' ? 'ar_LY' : 'en_US',
    },
  };
}
interface PrivacyPageProps {
    params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
    const { locale } = await params;
    const safeLocale = locale === 'ar' ? 'ar' : 'en';

    return <LegalContentViewer type="privacy" locale={safeLocale} />;
}
