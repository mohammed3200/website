import { useQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.users.$get, 200>;

export const useGetUsers = (
  page: number = 1,
  limit: number = 10,
  role?: string,
  status?: 'active' | 'inactive',
  search?: string,
) => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ['users', { page, limit, role, status, search }],
    queryFn: async () => {
      const response = await client.api.users.$get({
        query: {
          page: String(page),
          limit: String(limit),
          ...(role && { role }),
          ...(status && { status }),
          ...(search && { search }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    },
    staleTime: 1000 * 60, // 1 minute
  });

  return query;
};
