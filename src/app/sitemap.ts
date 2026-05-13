import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const STATIC = [
  '', 'about', 'entrepreneurship', 'incubators',
  'news', 'strategic-plan', 'faq', 'contact',
  'privacy', 'terms',
  'innovators/registration', 'collaborators',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries = STATIC.flatMap(p =>
    ['ar', 'en'].map(loc => ({
      url: `${SITE}/${loc}${p ? `/${p}` : ''}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: p === '' ? 1.0 : 0.7,
      alternates: { languages: { ar: `${SITE}/ar/${p}`, en: `${SITE}/en/${p}` } },
    })),
  );

  try {
    const news = await db.news.findMany({
      where: { isActive: true },
      select: { slug: true, id: true, updatedAt: true },
    });
    const newsEntries = news.flatMap(n =>
      ['ar', 'en'].map(loc => ({
        url: `${SITE}/${loc}/News/${n.slug ?? n.id}`,
        lastModified: n.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    );

    const plans = await db.strategicPlan.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    const planEntries = plans.flatMap(p =>
      ['ar', 'en'].map(loc => ({
        url: `${SITE}/${loc}/strategic-plan/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: 'yearly' as const,
        priority: 0.6,
      })),
    );

    return [...staticEntries, ...newsEntries, ...planEntries];
  } catch (error) {
    console.error('Failed to fetch dynamic sitemap entries:', error);
    return staticEntries;
  }
}
