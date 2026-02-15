// src/components/skeletons/innovator-card-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface InnovatorCardSkeletonProps {
  className?: string;
}

export function InnovatorCardSkeleton({
  className,
}: InnovatorCardSkeletonProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-2xl border border-border overflow-hidden flex flex-col h-full',
        className,
      )}
    >
      {/* Top Decorative Header */}
      <Skeleton className="h-24 rounded-none" />

      {/* Card Content */}
      <div className="px-6 pb-6 flex-1 flex flex-col">
        {/* Avatar (Overlapping) */}
        <div className="-mt-12 mb-4">
          <Skeleton className="w-20 h-20 rounded-2xl" />
        </div>

        {/* Identity */}
        <div className="mb-4 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Project Info */}
        <div className="mb-6 flex-1 space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-border/50 flex items-center justify-between mt-auto">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
