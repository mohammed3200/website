import { Skeleton } from '@/components/ui/skeleton';

export const HomeFaqSkeleton = () => (
  <section className="flex flex-col px-4 animate-pulse">
    <div className="text-center mb-16 space-y-4">
      <div className="inline-flex items-center justify-center p-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
      </div>
      <Skeleton className="w-64 h-10 mx-auto rounded-lg" />
      <Skeleton className="w-96 h-6 mx-auto rounded-lg" />
    </div>
    <div className="space-y-4 max-w-4xl mx-auto w-full">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="w-full h-16 rounded-2xl" />
      ))}
    </div>
  </section>
);
