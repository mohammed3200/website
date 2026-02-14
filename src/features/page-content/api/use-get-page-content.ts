import { useQuery } from '@tanstack/react-query';
import type { PageContentResponse } from '../types/page-content-type';

/**
 * React Query hook to fetch page content
 * @param page - The page name (entrepreneurship or incubators)
 * @param options - Query options including enabled flag
 */
export const useGetPageContent = (
  page: 'entrepreneurship' | 'incubators',
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ['page-content', page],
    queryFn: async () => {
      const response = await fetch(`/api/pageContent/public/${page}`);

      if (!response.ok) {
        throw new Error('Failed to fetch page content');
      }

      const data: PageContentResponse = await response.json();
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};
