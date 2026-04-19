'use client';

import { useState } from 'react';
import { LegalContentEditor } from '@/features/legal-content/components/legal-content-editor';
import { LegalContentType, LegalContentLocale } from '@prisma/client';

interface AdminLegalContentClientProps {
  title: string;
  description: string;
}

export function AdminLegalContentClient({ title, description }: AdminLegalContentClientProps) {
  const [type, setType] = useState<LegalContentType>('terms');
  const [locale, setLocale] = useState<LegalContentLocale>('ar');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as LegalContentType)}
          className="border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
        >
          <option value="terms">Terms of Use</option>
          <option value="privacy">Privacy Policy</option>
        </select>

        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as LegalContentLocale)}
          className="border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
        >
          <option value="ar">Arabic</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow min-h-[500px]">
        {/* Key ensures editor remounts / refetches correctly when params change */}
        <LegalContentEditor key={`${type}-${locale}`} type={type} locale={locale} />
      </div>
    </div>
  );
}
