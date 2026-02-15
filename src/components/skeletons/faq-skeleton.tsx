// src/components/skeletons/faq-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface FAQSkeletonProps {
  className?: string;
  count?: number;
}

export function FAQItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('border rounded-lg p-4', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-5 rounded" />
      </div>
    </div>
  );
}

export function FAQListSkeleton({ count = 5, className }: FAQSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <FAQItemSkeleton key={i} />
      ))}
    </div>
  );
}
