import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
  (typeof client.api.users.invitations)[':id']['$delete'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.users.invitations)[':id']['$delete']
>;

export const useDeleteInvitation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.users.invitations[':id'].$delete({
        param,
      });

      if (!response.ok) {
        throw new Error('Failed to delete invitation');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Invitation deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
    onError: () => {
      toast.error('Failed to delete invitation');
    },
  });

  return mutation;
};
