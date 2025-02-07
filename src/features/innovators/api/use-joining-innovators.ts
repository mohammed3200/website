import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.innovators)["$post"],
  200
>;
type RequestType = InferRequestType<(typeof client.api.innovators)["$post"]>;

export const useJoiningInnovators = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations("CreatorsAndInnovators");

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.innovators["$post"]({
        form,
      });
      if (!response.ok) {
        throw new Error("Failed to join innovators");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast({ 
        title: t("form.RequestSuccess"),
        success:true
        });
      queryClient.invalidateQueries({ queryKey: ["innovators"] });
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