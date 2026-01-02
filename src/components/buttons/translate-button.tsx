'use client';

import { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMedia } from 'react-use';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const locales = [
  { code: 'ar', title: 'العربية' },
  { code: 'en', title: 'English' },
];

export const TranslateButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = useMedia('(min-width: 1024px)', true);
  const [isPending, startTransition] = useTransition();

  const currentLocale = pathname.split('/').filter(Boolean)[0] || 'ar';

  const handleLanguageChange = (localeCode: string) => {
    if (localeCode === currentLocale) return;

    startTransition(() => {
      const pathSegments = pathname.split('/').filter(Boolean);

      if (
        pathSegments.length > 0 &&
        (pathSegments[0] === 'en' || pathSegments[0] === 'ar')
      ) {
        pathSegments[0] = localeCode;
      } else {
        pathSegments.unshift(localeCode);
      }

      const newPath = `/${pathSegments.join('/')}`;

      // Set cookie to persist preference
      document.cookie = `NEXT_LOCALE=${localeCode}; path=/; max-age=31536000; SameSite=Lax`;

      router.replace(newPath);
    });
  };

  const LanguageButton = ({ locale }: { locale: (typeof locales)[0] }) => {
    const isActive = currentLocale === locale.code;

    return (
      <button
        onClick={() => handleLanguageChange(locale.code)}
        disabled={isPending}
        className={cn(
          'relative px-4 py-1.5 text-sm rounded-full transition-all duration-300 font-medium z-10',
          'focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          isActive
            ? 'text-white'
            : 'text-gray-500 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400',
          isDesktop ? '' : 'flex-1 text-center',
        )}
        aria-label={`Switch to ${locale.title}`}
      >
        {isActive && (
          <motion.div
            layoutId="active-language-background"
            className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-sm -z-10"
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
          />
        )}
        <span className="relative z-10">{locale.title}</span>
      </button>
    );
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        !isDesktop && 'p-4 border-t border-gray-200 dark:border-gray-700',
      )}
    >
      <div
        dir="ltr"
        className={cn(
          'flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full relative',
          !isDesktop && 'w-full gap-2',
        )}
      >
        {locales.map((locale) => (
          <LanguageButton key={locale.code} locale={locale} />
        ))}
      </div>

      {isPending && (
        <div className="ml-2">
          <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};
