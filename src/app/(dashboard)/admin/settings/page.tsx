'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SETTINGS_OPTIONS } from '@/features/admin/constants/settings';

const TITLES_MAP: Record<string, string> = {
  general: 'General Settings',
  security: 'Security & Access',
  notifications: 'Notification Preferences',
  appearance: 'Appearance & Theme',
  languages: 'Language Support',
  advanced: 'Advanced Configuration',
  profile: 'Profile Configuration',
};

const DESCRIPTIONS_MAP: Record<string, string> = {
  general: 'Configure platform identity and basic information',
  security: 'Manage authentication and security protocols',
  notifications: 'Set up global alert and notification rules',
  appearance: 'Customize platform visual elements and themes',
  languages: 'Manage supported languages and translations',
  advanced: 'Fine-tune technical platform parameters',
  profile: 'Manage user profile and account settings',
};

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SETTINGS_OPTIONS.map((option: (typeof SETTINGS_OPTIONS)[number]) => {
          const key = option.titleKey.split('.')[0] || 'general';
          const content = (
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <option.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {TITLES_MAP[key] ||
                    key
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {DESCRIPTIONS_MAP[key] || 'Manage this setting configuration'}
                </p>
              </div>
            </div>
          );

          const className = cn(
            'block p-6 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors',
            option.disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:border-primary',
          );

          if (option.disabled) {
            return (
              <div
                key={option.titleKey}
                className={className}
                aria-disabled="true"
              >
                {content}
              </div>
            );
          }

          return (
            <Link
              key={option.titleKey}
              href={option.href}
              className={className}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsPage;
