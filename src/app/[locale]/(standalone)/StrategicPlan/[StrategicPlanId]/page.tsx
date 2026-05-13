import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { getTranslations } from 'next-intl/server';
import { StrategicPlanClient } from './strategic-plan-client';
import { notFound } from 'next/navigation';

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, '');
}

async function getStrategicPlan(slugOrId: string) {
  return db.strategicPlan.findFirst({
    where: { OR: [{ slug: slugOrId }, { id: slugOrId }], isActive: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; StrategicPlanId: string }>;
}): Promise<Metadata> {
  const { locale, StrategicPlanId } = await params;
  const plan = await getStrategicPlan(StrategicPlanId);
  const tMeta = await getTranslations({ locale, namespace: 'Meta' });
  const isAr = locale === 'ar';

  if (!plan) {
    return { title: tMeta('siteName'), description: tMeta('siteName') };
  }

  const title =
    plan.metaTitle ??
    (isAr ? plan.titleAr || plan.title : plan.title);

  const description =
    plan.metaDescription ??
    (isAr ? (plan.excerptAr || plan.excerpt || stripHtml(plan.contentAr || plan.content)).slice(0, 160)
          : (plan.excerpt || stripHtml(plan.content)).slice(0, 160));

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/StrategicPlan/${plan.slug ?? plan.id}`;

  return {
    title: `${title} | ${tMeta('siteName')}`,
    description,
    alternates: {
      canonical: url,
      languages: {
        ar: `${process.env.NEXT_PUBLIC_SITE_URL}/ar/StrategicPlan/${plan.slug ?? plan.id}`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/StrategicPlan/${plan.slug ?? plan.id}`,
        'x-default': url,
      },
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: tMeta('siteName'),
      locale: isAr ? 'ar_LY' : 'en_US',
      publishedTime: plan.createdAt?.toISOString(),
      modifiedTime: plan.updatedAt.toISOString(),
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function StrategicPlanArticlePage({
  params,
}: {
  params: Promise<{ locale: string; StrategicPlanId: string }>;
}) {
  const { StrategicPlanId, locale } = await params;
  const plan = await getStrategicPlan(StrategicPlanId);
  if (!plan) notFound();
  
  const isAr = locale === 'ar';
  const title = plan.metaTitle ?? (isAr ? plan.titleAr || plan.title : plan.title);
  const description = plan.metaDescription ?? (isAr ? (plan.excerptAr || plan.excerpt || stripHtml(plan.contentAr || plan.content)).slice(0, 160) : (plan.excerpt || stripHtml(plan.content)).slice(0, 160));
  const tMeta = await getTranslations({ locale, namespace: 'Meta' });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "datePublished": plan.createdAt?.toISOString(),
    "dateModified": plan.updatedAt.toISOString(),
    "author": { "@type": "Organization", "name": tMeta('siteName') },
    "publisher": {
      "@type": "Organization",
      "name": tMeta('siteName'),
      "logo": { "@type": "ImageObject", "url": "/images/logo.png" }
    },
    "description": description,
    "inLanguage": isAr ? 'ar' : 'en'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StrategicPlanClient StrategicPlan={plan} locale={locale} />
    </>
  );
}
