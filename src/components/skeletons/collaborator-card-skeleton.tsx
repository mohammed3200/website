// src/components/skeletons/collaborator-card-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CollaboratorCardSkeletonProps {
  className?: string;
}

export function CollaboratorCardSkeleton({
  className,
}: CollaboratorCardSkeletonProps) {
  return (
    <div
      className={cn(
        'md:w-[600px] md:h-[320px] bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row',
        className,
      )}
    >
      {/* LEFT SECTION: Identity */}
      <div className="w-full md:w-[240px] shrink-0 bg-white flex flex-col items-center justify-center p-6 border-b md:border-b-0 border-gray-100">
        <Skeleton className="w-[160px] h-[160px] rounded-full mb-4" />
        <Skeleton className="w-12 h-px mb-4" />
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Vertical Divider */}
      <div className="hidden md:block w-px bg-gray-100 self-stretch my-8" />

      {/* RIGHT SECTION: Information */}
      <div className="flex-1 min-w-0 p-8 flex flex-col">
        <div className="mb-4">
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>

        <div className="mb-6 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        <div className="mt-auto space-y-3 pt-6 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
}
