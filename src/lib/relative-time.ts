import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

export function getRelativeTime(date: Date | string, locale: 'ar' | 'en'): string {
  const d = new Date(date);
  
  try {
    return formatDistanceToNow(d, {
      addSuffix: true,
      locale: locale === 'ar' ? ar : enUS,
    });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    // Fallback to absolute date if relative formatting fails
    return d.toLocaleDateString(locale === 'ar' ? 'ar-LY' : 'en-US');
  }
}
