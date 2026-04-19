import { AdminLegalContentClient } from './client';
import { getTranslations } from 'next-intl/server';

export default async function LegalContentPage() {
  const t = await getTranslations('Admin.Settings.legalContent');

  return (
    <AdminLegalContentClient 
      title={t('title')} 
      description={t('description')} 
    />
  );
}
