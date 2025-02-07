import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.collaborator)["$post"],
  200
>;
type RequestType = InferRequestType<(typeof client.api.collaborator)["$post"]>;

export const useJoiningCollaborators = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations("collaboratingPartners");

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.collaborator["$post"]({
        form,
      });
      if (!response.ok) {
        throw new Error("Failed to join collaborators");
      }

      return await response.json() as ResponseType;
    },
    onSuccess: () => {
      toast({ 
        title: t("form.RequestSuccess"),
        success:true
        });
      queryClient.invalidateQueries({ queryKey: ["collaborator"] });
    },
    onError: () => {
      toast({ 
        title: t("form.RequestFailed"),
        error:true
      });
    },
  });

  return mutation;
};
