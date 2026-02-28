import { AlertCircle, RefreshCw } from 'lucide-react';
import { useGetSubmissions } from '@/features/admin/api/submissions/use-get-submissions';
import { TableSkeleton } from '@/components/skeletons';
import SubmissionsContent from './components/submissions-content';

const SubmissionsPage = () => {
  const { data, isLoading, isError, error, refetch } = useGetSubmissions();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <TableSkeleton rows={8} columns={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-gray-200 shadow-sm max-w-md mx-auto mt-10">
        <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to load submissions
        </h3>
        <p className="text-sm text-gray-600 text-center mb-6">
          {error instanceof Error
            ? error.message
            : 'An unexpected error occurred'}
        </p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <SubmissionsContent
      innovators={data?.innovators || []}
      collaborators={data?.collaborators || []}
    />
  );
};

export default SubmissionsPage;
