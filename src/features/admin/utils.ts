/**
 * Formats a date to a "time ago" string in Arabic or English
 */
export function formatTimeAgo(date: Date, locale: string): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const isAr = locale === 'ar';

  if (diffInSeconds < 60) return isAr ? 'الآن' : 'just now';
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return isAr ? `منذ ${mins} دقيقة` : `${mins}m ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return isAr ? `منذ ${hours} ساعة` : `${hours}h ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return isAr ? `منذ ${days} يوم` : `${days}d ago`;
  }
  return date.toLocaleDateString(isAr ? 'ar-EG' : 'en-US');
}

/**
 * Returns the CSS classes for a notification priority
 */
export function getPriorityColor(priority: string) {
  switch (priority) {
    case 'URGENT':
      return 'bg-red-500 text-white';
    case 'HIGH':
      return 'bg-orange-500 text-white';
    case 'NORMAL':
      return 'bg-blue-500 text-white';
    case 'LOW':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

export const NOTIFICATION_TYPES = {
  NEW_COLLABORATOR: 'New Collaborator',
  NEW_INNOVATOR: 'New Innovator',
  SUBMISSION_APPROVED: 'Submission Approved',
  SUBMISSION_REJECTED: 'Submission Rejected',
  SYSTEM_ERROR: 'System Error',
  SECURITY_ALERT: 'Security Alert',
} as const;

/**
 * Returns the translated label for a notification type
 */
export function getTypeLabel(type: string, t?: any): string {
  if (t) {
    try {
      if (typeof t === 'function') {
        return t(`types.${type}`);
      }
      // If t is the NOTIFICATION_TYPES object
      return (t as any)[type] || type.replace(/_/g, ' ');
    } catch {
      // Fallback to static labels
    }
  }

  return (
    NOTIFICATION_TYPES[type as keyof typeof NOTIFICATION_TYPES] ||
    type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  );
}

/**
 * Validates if a URL is a safe internal admin URL
 */
export function isSafeAdminUrl(url: string | null | undefined): boolean {
  if (!url) return false;

  try {
    // Normalize path by resolving relativeness if any (e.g. /admin/../)
    const normalizedPath = new URL(url, 'http://localhost').pathname;

    return (
      normalizedPath.startsWith('/admin/') ||
      normalizedPath.startsWith('/en/admin/') ||
      normalizedPath.startsWith('/ar/admin/')
    );
  } catch {
    return false;
  }
}
