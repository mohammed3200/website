import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { getTranslations } from 'next-intl/server';
import { NewsClient } from './news-client';
import { notFound } from 'next/navigation';
import { sanitizeJsonForScript } from '@/lib/server-utils';
import { cache } from 'react';
import { getSiteUrl } from '@/lib/env-utils';

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const getNews = cache(async (slugOrId: string) => {
  return db.news.findFirst({
    where: { OR: [{ slug: slugOrId }, { id: slugOrId }], isActive: true },
    include: { image: true },
  });
});

const siteUrl = getSiteUrl();

function deriveNewsSeo(news: any, locale: string) {
  const isAr = locale === 'ar';
  const title =
    news.metaTitle ??
    (isAr ? news.title : (news.titleEn ?? news.title));

  const description =
    news.metaDescription ??
    (isAr ? (news.excerpt ?? stripHtml(news.content)).slice(0, 160)
          : (news.excerptEn ?? stripHtml(news.contentEn ?? news.content)).slice(0, 160));

  let ogImage = news.image?.url ?? '/images/placeholders/news-placeholder.jpg';
  if (ogImage.startsWith('/')) {
    ogImage = `${siteUrl}${ogImage}`;
  }

  return { title, description, ogImage };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; newsId: string }>;
}): Promise<Metadata> {
  const { locale, newsId } = await params;
  const news = await getNews(newsId);
  const tMeta = await getTranslations({ locale, namespace: 'Meta' });
  const isAr = locale === 'ar';

  if (!news) {
    return { title: tMeta('news.title'), description: tMeta('news.description') };
  }

  const { title, description, ogImage } = deriveNewsSeo(news, locale);
  const url = `${siteUrl}/${locale}/News/${news.slug ?? news.id}`;

  return {
    title: `${title} | ${tMeta('siteName')}`,
    description,
    alternates: {
      canonical: url,
      languages: {
        ar: `${siteUrl}/ar/News/${news.slug ?? news.id}`,
        en: `${siteUrl}/en/News/${news.slug ?? news.id}`,
        'x-default': `${siteUrl}/News/${news.slug ?? news.id}`,
      },
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: tMeta('siteName'),
      locale: isAr ? 'ar_LY' : 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      publishedTime: news.publishedAt?.toISOString(),
      modifiedTime: news.updatedAt.toISOString(),
      tags: news.tags?.split(',').map(t => t.trim()),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ locale: string; newsId: string }>;
}) {
  const { newsId, locale } = await params;
  const news = await getNews(newsId);
  if (!news) notFound();
  
  const { title, description, ogImage } = deriveNewsSeo(news, locale);
  const tMeta = await getTranslations({ locale, namespace: 'Meta' });
  const isAr = locale === 'ar';

  const publisherLogo = `${siteUrl}/images/logo.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "image": [ogImage],
    "datePublished": news.publishedAt?.toISOString(),
    "dateModified": news.updatedAt.toISOString(),
    "author": { "@type": "Organization", "name": tMeta('siteName') },
    "publisher": {
      "@type": "Organization",
      "name": tMeta('siteName'),
      "logo": { "@type": "ImageObject", "url": publisherLogo }
    },
    "description": description,
    "inLanguage": isAr ? 'ar' : 'en'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonForScript(jsonLd) }}
      />
      <NewsClient news={news} locale={locale} />
    </>
  );
}
