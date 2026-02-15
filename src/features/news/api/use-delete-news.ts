import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

export const useDeleteNews = () => {
    const queryClient = useQueryClient();

    return useMutation<boolean, Error, string>({
        mutationFn: async (id) => {
            const response = await client.api.news[":id"].$delete({
                param: { id }
            });

            if (!response.ok) {
                throw new Error("Failed to delete news");
            }

            return true;
        },
        onSuccess: () => {
            toast.success("News deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["news"] });
        },
        onError: () => {
            toast.error("Failed to delete news");
        },
    });
};
