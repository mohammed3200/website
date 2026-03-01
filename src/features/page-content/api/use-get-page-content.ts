import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/rpc';

export const useGetPageContent = (
  page: 'entrepreneurship' | 'incubators',
  options?: { enabled?: boolean },
) => {
  const query = useQuery({
    queryKey: ['page-content', page],
    queryFn: async () => {
      const response = await client.api.pageContent.public[':page'].$get({
        param: { page },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch page content');
      }

      const { data } = await response.json();
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });

  return query;
};
