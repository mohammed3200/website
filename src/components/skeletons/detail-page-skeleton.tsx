// src/components/skeletons/detail-page-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface DetailPageSkeletonProps {
  className?: string;
}

export function DetailPageSkeleton({ className }: DetailPageSkeletonProps) {
  return (
    <div className={cn('max-w-4xl mx-auto px-4 py-8', className)}>
      {/* Header Image */}
      <Skeleton className="h-64 md:h-96 w-full rounded-xl mb-8" />

      {/* Title and Meta */}
      <div className="space-y-4 mb-8">
        <Skeleton className="h-10 w-3/4" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/6" />

        <div className="my-8">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
