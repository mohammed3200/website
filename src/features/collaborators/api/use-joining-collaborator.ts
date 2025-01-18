import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.collaborator)["$post"],
  200
>;
type RequestType = InferRequestType<(typeof client.api.collaborator)["$post"]>;

export const useJoiningCollaborators = () => {
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

      const data = await response.json();
      return data as ResponseType;
    },
    onSuccess: () => {
      toast.success(t("form.RequestSuccess"));
      queryClient.invalidateQueries({ queryKey: ["collaborator"] });
    },
    onError: () => {
      toast.error(t("form.RequestFailed"));
    },
  });

  return mutation;
};
