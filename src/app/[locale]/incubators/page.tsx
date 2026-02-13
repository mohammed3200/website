import { getPageContent } from '@/features/page-content';
import IncubatorsClient from './components/incubators-client';

export default async function IncubatorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch page content using feature helper
  const content = await getPageContent('incubators');

  return <IncubatorsClient locale={locale} content={content} />;
}
