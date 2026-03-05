import { LegalContentViewer } from '@/features/legal-content';

interface PrivacyPageProps {
    params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
    const { locale } = await params;
    const safeLocale = locale === 'ar' ? 'ar' : 'en';

    return <LegalContentViewer type="privacy" locale={safeLocale} />;
}
