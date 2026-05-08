import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageContent } from '@/features/page-content/server/route';
import {
  AboutHero,
  CenterGoals,
  PlatformIntro,
  AboutNews,
} from './components';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tCommon = await getTranslations({ locale, namespace: 'Common' });
  const tNav = await getTranslations({ locale, namespace: 'Navigation' });

  return {
    title: `${tNav('about')} | ${tCommon('centerName')}`,
    description: tNav('aboutDesc'),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const content = await getPageContent('about');

  const heroContent = content.find((c) => c.section === 'hero');
  const platformContent = content.find((c) => c.section === 'platform');
  const goals = content
    .filter((c) => c.section === 'goals')
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const newsContent = content.find((c) => c.section === 'news');

  return (
    <div className="flex flex-col">
      <AboutHero locale={locale} item={heroContent ?? null} />
      <CenterGoals locale={locale} items={goals} />
      <PlatformIntro locale={locale} item={platformContent ?? null} />
      {newsContent ? <AboutNews locale={locale} item={newsContent} /> : null}
    </div>
  );
}
