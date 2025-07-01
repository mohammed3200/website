// FIXME: cache for news and create news schema
// import { unstable_cache } from 'next/cache';

// export const getCachedNews = unstable_cache(
//   async () => prisma.news.findMany(),
//   ['all-news'],
//   { tags: ['news'], revalidate: 3600 }
// );