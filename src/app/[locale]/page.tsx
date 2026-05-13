import { Hero } from "@/components";
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { sanitizeJsonForScript } from '@/lib/server-utils';
import { getSiteUrl } from '@/lib/env-utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: 'Meta' });
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/${locale}`;

  return {
    title: tMeta('home.title'),
    description: tMeta('home.description'),
    alternates: {
      canonical: url,
      languages: {
        ar: `${siteUrl}/ar`,
        en: `${siteUrl}/en`,
        'x-default': siteUrl,
      },
    },
    openGraph: {
      title: tMeta('home.title'),
      description: tMeta('home.description'),
      url,
      locale: locale === 'ar' ? 'ar_LY' : 'en_US',
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: 'Meta' });

  const siteUrl = getSiteUrl();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: tMeta('siteName'),
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+218-XX-XXXXXXX',
      contactType: 'customer service',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonForScript(jsonLd) }}
      />
      <Hero />
    </>
  );
}