import { useQuery } from '@tanstack/react-query';

export const useGetSubmissions = () => {
  return useQuery({
    queryKey: ['admin', 'submissions'],
    queryFn: async () => {
      const response = await fetch('/api/admin/submissions');
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      return response.json() as Promise<{
        innovators: any[];
        collaborators: any[];
      }>;
    },
  });
};
