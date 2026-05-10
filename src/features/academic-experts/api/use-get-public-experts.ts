import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useGetPublicExperts = () => {
  return useQuery({
    queryKey: ['public-academic-experts'],
    queryFn: async () => {
      const response = await client.api['academic-experts'].public.$get();
      if (!response.ok) {
        throw new Error('Failed to fetch public academic experts');
      }
      const { data } = await response.json();
      return data;
    },
  });
};
