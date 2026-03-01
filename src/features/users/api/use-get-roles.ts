import { useQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.users.roles.$get, 200>;

export const useGetRoles = () => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await client.api.users.roles.$get();

      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }

      return await response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return query;
};
