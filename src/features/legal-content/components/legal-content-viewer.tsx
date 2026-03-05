'use client';

import { sanitizeHtml } from '@/lib/sanitizer';
import type { LegalContentType, LegalContentLocale } from '../types/legal-content-type';
import { useGetLegalContent } from '../api/use-get-legal-content';
import { LEGAL_CONTENT_DEFAULTS, type LegalContentKey } from '../constants/legal-content-constants';

interface LegalContentViewerProps {
    type: LegalContentType;
    locale: LegalContentLocale;
}

export function LegalContentViewer({ type, locale }: LegalContentViewerProps) {
    const { data, isLoading, isError } = useGetLegalContent(type, locale);

    if (isLoading) {
        return (
            <div className="container mx-auto py-20 px-4 max-w-4xl animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-1/3 mb-8" />
                <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-4/6" />
                </div>
            </div>
        );
    }

    const fallbackKey = `${type}:${locale}` as LegalContentKey;
    const defaults = LEGAL_CONTENT_DEFAULTS[fallbackKey];

    const title = data?.title ?? defaults?.title ?? type;
    const rawContent = data?.content ?? defaults?.content ?? '';

    // Sanitize HTML content safely on both server and client
    const sanitizedContent = sanitizeHtml(rawContent);

    if (isError) {
        return (
            <div className="container mx-auto py-20 px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">{title}</h1>
                <p className="text-red-500">Failed to load content. Please try again later.</p>
            </div>
        );
    }

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
