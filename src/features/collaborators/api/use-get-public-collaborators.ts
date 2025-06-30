import { useQuery } from "@tanstack/react-query";
import { PublicCollaborator } from "../types";

import { client } from "@/lib/rpc";

export const useGetCollaborators = () => {
  const query = useQuery<PublicCollaborator[], Error>({
    queryKey: ["collaborators"],
    queryFn: async () => {
      const response = await client.api.collaborator['public']['$get']();
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch collaborators");
      }
      
      const { data } = await response.json();

      return data as PublicCollaborator[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return query;
};