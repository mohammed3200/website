import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { UpdateNewsInput, News } from "../types";
import { toast } from "sonner";

export const useUpdateNews = () => {
    const queryClient = useQueryClient();

    return useMutation<News, Error, { id: string; values: any }>({
        mutationFn: async ({ id, values }) => {
            const formData = new FormData();

            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === 'imageFile' && value instanceof File) {
                        formData.append('image', value);
                    } else if (value instanceof Date) {
                        formData.append(key, value.toISOString());
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });

            const response = await client.api.news[":id"].$patch({
                param: { id },
                form: formData as any,
            });

            if (!response.ok) {
                const error = await response.json() as any;
                throw new Error(error.message || "Failed to update news");
            }

            const { data } = await response.json();
            return data as any;
        },
        onSuccess: (_, { id }) => {
            toast.success("News updated successfully");
            queryClient.invalidateQueries({ queryKey: ["news"] });
            queryClient.invalidateQueries({ queryKey: ["news", id] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update news");
        },
    });
};
