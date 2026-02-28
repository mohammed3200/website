// Settings page definition

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SETTINGS_OPTIONS } from '@/features/admin/constants/settings';

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SETTINGS_OPTIONS.map((option) => {
          const content = (
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <option.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {option.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {option.description}
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
              <div key={option.id} className={className} aria-disabled="true">
                {content}
              </div>
            );
          }

          return (
            <Link key={option.id} href={option.href} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsPage;
