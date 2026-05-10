import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useGetExperts = () => {
  return useQuery({
    queryKey: ['academic-experts'],
    queryFn: async () => {
      const response = await client.api['academic-experts'].$get();
      if (!response.ok) {
        throw new Error('Failed to fetch academic experts');
      }
      const { data } = await response.json();
      return data;
    },
  });
};
