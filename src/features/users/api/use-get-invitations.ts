import { useQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
  typeof client.api.users.invitations.list.$get,
  200
>;

export const useGetInvitations = (page: number = 1, limit: number = 10) => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ['invitations', { page, limit }],
    queryFn: async () => {
      const response = await client.api.users.invitations.list.$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invitations');
      }

      return await response.json();
    },
    staleTime: 1000 * 60, // 1 minute
  });

  return query;
};
