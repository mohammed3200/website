'use client';

import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetQueueHealth, type QueueHealth } from '@/features/admin/api/queues/use-get-queue-health';
import { cn } from '@/lib/utils';

export interface QueueHealthCardProps {
  locale?: 'ar' | 'en';
}

/**
 * Live queue-health panel: shows email + WhatsApp BullMQ counts and the
 * last-24 h sent/failed totals from the EmailLog / WhatsAppLog tables.
 *
 * - Server fetcher caches at 60 s (queue-health.ts)
 * - Client refetch interval: 60 s
 * - When Redis is unavailable, the snapshot still renders with mock=true so
 *   the operator sees that the queue is degraded, not blank.
 */
export function QueueHealthCard({ locale = 'en' }: QueueHealthCardProps) {
  const isArabic = locale === 'ar';
  const t = useTranslationsSafe();
  const { data, isLoading, isError } = useGetQueueHealth();

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  return (
    <Card dir={isArabic ? 'rtl' : 'ltr'}>
      <CardHeader>
        <CardTitle>{t('queueHealth.title', isArabic ? 'حالة قوائم الانتظار' : 'Queue health')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isError ? (
          <p className="text-sm text-red-500">
            {t('queueHealth.error', isArabic ? 'تعذر تحميل بيانات قوائم الانتظار' : 'Failed to load queue data')}
          </p>
        ) : (
          <>
            <QueueRow
              label={isArabic ? 'البريد الإلكتروني' : 'Email'}
              snapshot={data!.email}
              isArabic={isArabic}
            />
            <QueueRow
              label={isArabic ? 'واتساب' : 'WhatsApp'}
              snapshot={data!.whatsapp}
              isArabic={isArabic}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function QueueRow({
  label,
  snapshot,
  isArabic,
}: {
  label: string;
  snapshot: QueueHealth;
  isArabic: boolean;
}) {
  const ok = snapshot.failed === 0 && !snapshot.mock;
  return (
    <div className="border border-gray-100 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-900">{label}</span>
        <span
          className={cn(
            'text-xs font-mono px-2 py-0.5 rounded',
            snapshot.mock
              ? 'bg-yellow-50 text-yellow-700'
              : ok
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700',
          )}
        >
          {snapshot.mock
            ? isArabic ? 'غير متصل' : 'no Redis'
            : ok
              ? isArabic ? 'سليم' : 'healthy'
              : isArabic ? 'يحتوي على فشل' : 'has failures'}
        </span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs text-gray-600">
        <Cell label={isArabic ? 'في الانتظار' : 'waiting'} value={snapshot.waiting} />
        <Cell label={isArabic ? 'نشط' : 'active'} value={snapshot.active} />
        <Cell label={isArabic ? 'مكتمل' : 'completed'} value={snapshot.completed} />
        <Cell label={isArabic ? 'فشل' : 'failed'} value={snapshot.failed} highlight={snapshot.failed > 0} />
        <Cell label={isArabic ? '24س مرسل' : '24h sent'} value={snapshot.last24h.sent} />
      </div>
    </div>
  );
}

function Cell({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-gray-400">{label}</span>
      <span className={cn('font-mono', highlight ? 'text-red-600 font-semibold' : 'text-gray-900')}>
        {value}
      </span>
    </div>
  );
}

/**
 * Translation helper that falls back to a static string when the i18n key
 * isn't yet defined. Lets us ship this widget without forcing every consumer
 * locale file to land first.
 */
function useTranslationsSafe() {
  let t: ((k: string) => string) | null = null;
  try {
    t = useTranslations('Admin');
  } catch {
    /* No provider — fall through to fallback */
  }
  return (key: string, fallback: string) => {
    try {
      const v = t?.(key);
      if (v && v !== `Admin.${key}` && !v.includes('Admin.')) return v;
    } catch {
      /* missing key — use fallback */
    }
    return fallback;
  };
}
