'use client';

import { useState, useEffect } from 'react';
import { usePatchLegalContent } from '../api/use-patch-legal-content';
import { useGetLegalContent } from '../api/use-get-legal-content';
import type { LegalContentType, LegalContentLocale } from '../types/legal-content-type';

interface LegalContentEditorProps {
    type: LegalContentType;
    locale: LegalContentLocale;
}

export function LegalContentEditor({ type, locale }: LegalContentEditorProps) {
    const { data, isLoading } = useGetLegalContent(type, locale);
    const { mutate, isPending } = usePatchLegalContent();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (data) {
            setTitle(data.title ?? '');
            setContent(data.content ?? '');
        }
    }, [data]);

    const handleSave = () => {
        mutate({
            json: { type, locale, title, content },
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-1/3" />
                <div className="h-40 bg-gray-200 rounded" />
            </div>
        );
    }

    const label = type === 'privacy' ? 'Privacy Policy' : 'Terms of Use';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                    {label} ({locale.toUpperCase()})
                </h3>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isPending}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors font-medium text-sm"
                >
                    {isPending ? 'Saving...' : 'Save'}
                </button>
            </div>

            {/* Title */}
            <div>
                <label htmlFor={`legal-title-${type}-${locale}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                </label>
                <input
                    id={`legal-title-${type}-${locale}`}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isPending}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:opacity-50"
                />
            </div>

            {/* Content (HTML textarea for now — swap for TipTap/rich editor later) */}
            <div>
                <label htmlFor={`legal-content-${type}-${locale}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Content (HTML)
                </label>
                <textarea
                    id={`legal-content-${type}-${locale}`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isPending}
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:opacity-50 resize-y"
                />
            </div>
        </div>
    );
}
