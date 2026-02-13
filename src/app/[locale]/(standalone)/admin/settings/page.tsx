'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';
import { SETTINGS_OPTIONS } from '@/features/admin/constants/settings';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const t = useTranslations('Admin.Settings');
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SETTINGS_OPTIONS.map((option) => (
          <Link
            key={option.titleKey}
            href={option.disabled ? '#' : `/${lang}${option.href}`}
            className={cn(
              'block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-primary transition-colors',
              option.disabled && 'opacity-50 cursor-not-allowed',
            )}
            aria-disabled={option.disabled}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <option.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {t(option.titleKey)}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {t(option.descriptionKey)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
