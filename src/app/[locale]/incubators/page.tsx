import { db } from '@/lib/db';
import IncubatorsClient from './components/incubators-client';

export default async function IncubatorsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Fetch page content from database
  const content = await db.pageContent.findMany({
    where: {
      page: 'incubators',
      isActive: true,
    },
    orderBy: [{ section: 'asc' }, { order: 'asc' }],
  });

  return <IncubatorsClient locale={locale} content={content} />;
}