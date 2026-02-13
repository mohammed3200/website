import { getPageContent } from '@/features/page-content';
import EntrepreneurshipClient from './components/entrepreneurship-client';

export default async function EntrepreneurshipPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch page content using feature helper
  const content = await getPageContent('entrepreneurship');

  return <EntrepreneurshipClient locale={locale} content={content} />;
}
