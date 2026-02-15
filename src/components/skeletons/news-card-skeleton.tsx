// src/components/skeletons/news-card-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface NewsCardSkeletonProps {
  className?: string;
}

export function NewsCardSkeleton({ className }: NewsCardSkeletonProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <Skeleton className="h-48 w-full rounded-none" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </CardFooter>
    </Card>
  );
}

export function NewsGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}
