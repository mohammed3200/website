import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { CreateNewsInput, News } from "../types";
import { toast } from "sonner";

export const useCreateNews = () => {
    const queryClient = useQueryClient();

    return useMutation<News, Error, any>({
        mutationFn: async (values) => {
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

            const response = await client.api.news.$post({ form: formData as any });

            if (!response.ok) {
                const error = await response.json() as any;
                throw new Error(error.message || "Failed to create news");
            }

            const { data } = await response.json();
            return data as any;
        },
        onSuccess: () => {
            toast.success("News created successfully");
            queryClient.invalidateQueries({ queryKey: ["news"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create news");
        },
    });
};
