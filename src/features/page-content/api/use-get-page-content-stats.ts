import { useQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
  typeof client.api.pageContent.stats.$get,
  200
>;

export const useGetPageContentStats = () => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ['page-content-stats'],
    queryFn: async () => {
      const response = await client.api.pageContent.stats.$get();

      if (!response.ok) {
        throw new Error('Failed to fetch page content statistics');
      }

      return await response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return query;
};
