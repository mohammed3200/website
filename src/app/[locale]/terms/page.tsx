import { LegalContentViewer } from '@/features/legal-content';

interface TermsPageProps {
    params: Promise<{ locale: string }>;
}

export default async function TermsPage({ params }: TermsPageProps) {
    const { locale } = await params;
    const safeLocale = locale === 'ar' ? 'ar' : 'en';

    return <LegalContentViewer type="terms" locale={safeLocale} />;
}
