import { Skeleton } from '@/components/ui/skeleton';

export const HomeNewsSkeleton = () => (
  <div className="container mx-auto px-4 py-16 animate-pulse">
    <div className="flex items-center justify-between mb-10">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <Skeleton className="w-48 h-8 rounded-lg" />
      </div>
      <div className="hidden md:flex gap-2">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
    </div>
    <div className="max-w-6xl mx-auto h-[500px] md:h-[400px] bg-white rounded-3xl border border-gray-100 flex flex-col md:flex-row overflow-hidden">
      <Skeleton className="w-full md:w-1/2 h-1/2 md:h-full" />
      <div className="w-full md:w-1/2 p-6 md:p-10 space-y-4 flex flex-col justify-center">
        <Skeleton className="w-24 h-6 rounded-full" />
        <Skeleton className="w-3/4 h-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-2/3 h-4" />
        </div>
        <Skeleton className="w-32 h-12 rounded-xl mt-4" />
      </div>
    </div>
    <div className="flex justify-center gap-2 mt-8">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="w-2 h-2 rounded-full" />
      ))}
    </div>
  </div>
);
