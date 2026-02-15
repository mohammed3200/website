// src/components/skeletons/strategic-plan-card-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StrategicPlanCardSkeletonProps {
  className?: string;
}

export function StrategicPlanCardSkeleton({
  className,
}: StrategicPlanCardSkeletonProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <Skeleton className="h-40 w-full rounded-none" />
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}

export function StrategicPlanGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <StrategicPlanCardSkeleton key={i} />
      ))}
    </div>
  );
}
