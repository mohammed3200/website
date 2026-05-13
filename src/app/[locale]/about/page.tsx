import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageContent } from '@/features/page-content/server/route';
import {
  AboutHero,
  CenterGoals,
  PlatformIntro,
  AboutNews,
  PartnersGrid,
  AgreementsList,
} from './components';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: 'Meta' });
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/about`;

  return {
    title: tMeta('about.title'),
    description: tMeta('about.description'),
    alternates: {
      canonical: url,
      languages: {
        ar: `${process.env.NEXT_PUBLIC_SITE_URL}/ar/about`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/about`,
        'x-default': url,
      },
    },
    openGraph: {
      title: tMeta('about.title'),
      description: tMeta('about.description'),
      url,
      locale: locale === 'ar' ? 'ar_LY' : 'en_US',
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const content = await getPageContent('about');
  const activeContent = content.filter((c) => c.isActive);

  const heroContent = activeContent.find((c) => c.section === 'hero');
  const platformContent = activeContent.find((c) => c.section === 'platform');
  const goals = activeContent
    .filter((c) => c.section === 'goals')
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const newsContent = activeContent.find((c) => c.section === 'news');
  const partners = activeContent
    .filter((c) => c.section === 'partners')
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const agreements = activeContent
    .filter((c) => c.section === 'agreements')
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="flex flex-col">
      <AboutHero locale={locale} item={heroContent ?? null} />
      <CenterGoals locale={locale} items={goals} />
      {partners.length > 0 && <PartnersGrid locale={locale} items={partners} />}
      <PlatformIntro locale={locale} item={platformContent ?? null} />
      {agreements.length > 0 && <AgreementsList locale={locale} items={agreements} />}
      {newsContent ? <AboutNews locale={locale} item={newsContent} /> : null}
    </div>
  );
}
