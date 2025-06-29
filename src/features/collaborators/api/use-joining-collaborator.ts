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
  const tForm = useTranslations("Form"); // Add this for form error translations

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.collaborator["$post"]({
        form,
      });
      if (!response.ok) {
        // Parse the error response to get the error code
        const errorData = await response.json();
        throw new Error(errorData.code || "UNKNOWN_ERROR");
      }

      return await response.json() as ResponseType;
    },
    onSuccess: () => {
      toast({
        title: t("form.RequestSuccess"),
        success: true
      });
      queryClient.invalidateQueries({ queryKey: ["collaborator"] });
    },
    onError: (error) => {
      // Handle specific error codes with translations
      switch (error.message) {
        case "EMAIL_EXISTS":
          toast({
            title: tForm("EmailExists"), // New translation key
            error: true
          });
          break;
        case "PHONE_EXISTS":
          toast({
            title: tForm("PhoneExists"), // New translation key
            error: true
          });
          break;
        default:
          toast({
            title: t("form.RequestFailed"),
            error: true
          });
      }
    },
  });

  return mutation;
};
