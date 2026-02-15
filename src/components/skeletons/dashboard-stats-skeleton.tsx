// src/components/skeletons/dashboard-stats-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardStatsSkeletonProps {
  className?: string;
  count?: number;
}

export function DashboardStatsCardSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-40" />
      </CardContent>
    </Card>
  );
}

export function DashboardStatsGridSkeleton({
  count = 4,
  className,
}: DashboardStatsSkeletonProps) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <DashboardStatsCardSkeleton key={i} />
      ))}
    </div>
  );
}
