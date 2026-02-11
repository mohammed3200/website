import { db } from '@/lib/db';
import EntrepreneurshipClient from './components/entrepreneurship-client';

export default async function EntrepreneurshipPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Fetch page content from database
  const content = await db.pageContent.findMany({
    where: {
      page: 'entrepreneurship',
      isActive: true,
    },
    orderBy: [{ section: 'asc' }, { order: 'asc' }],
  });

  return <EntrepreneurshipClient locale={locale} content={content} />;
}