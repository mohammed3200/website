import { Skeleton } from '@/components/ui/skeleton';

export const HomeStrategicPlanSkeleton = () => (
  <section className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto w-full md:border-2 md:border-gray-100 rounded-3xl p-4 overflow-hidden animate-pulse">
    {[1, 2].map((i) => (
      <div
        key={i}
        className="col-span-1 h-64 md:h-80 bg-gray-50 rounded-3xl p-6 md:p-10 flex flex-col justify-center gap-4"
      >
        <Skeleton className="w-24 h-24 rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-40 h-10 rounded-xl mt-4" />
        </div>
      </div>
    ))}
  </section>
);
