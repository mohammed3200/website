'use client';

import { useGetSubmissions } from '@/features/admin/api/use-submissions';
import SubmissionsContent from './components/submissions-content';

export default function SubmissionsPage() {
  const { data, isLoading } = useGetSubmissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-orange-600" />
      </div>
    );
  }

  return (
    <SubmissionsContent
      innovators={data?.innovators || []}
      collaborators={data?.collaborators || []}
    />
  );
}
