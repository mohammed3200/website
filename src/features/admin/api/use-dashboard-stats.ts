import { useQuery } from '@tanstack/react-query';

export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard statistics');
      }
      return response.json() as Promise<{
        totalInnovators: number;
        totalCollaborators: number;
        pendingInnovators: number;
        pendingCollaborators: number;
        totalStrategicPlans: number;
        totalNews: number;
        approvedInnovators: number;
        approvedCollaborators: number;
      }>;
    },
  });
};
