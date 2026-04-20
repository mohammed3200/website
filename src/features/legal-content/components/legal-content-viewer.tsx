import { sanitizeHtml } from '@/lib/sanitizer';
import type { LegalContentType, LegalContentLocale } from '../types/legal-content-type';
import { getLegalContent } from '../server/route';

interface LegalContentViewerProps {
    type: LegalContentType;
    locale: LegalContentLocale;
}

export async function LegalContentViewer({ type, locale }: LegalContentViewerProps) {
    const data = await getLegalContent(type as any, locale as any);

    const title = data?.title ?? type;
    const rawContent = data?.content ?? '';

    // Sanitize HTML content safely on both server and client
    const sanitizedContent = sanitizeHtml(rawContent);

    return (
        <div className="container mx-auto py-20 px-4 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">{title}</h1>
            <div
                className="prose prose-orange lg:prose-xl max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
            {data?.updatedAt && (
                <p className="mt-12 text-sm text-gray-400">
                    Last updated: {new Date(data.updatedAt).toLocaleDateString(locale === 'ar' ? 'ar-LY' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </p>
            )}
        </div>
    );
}
