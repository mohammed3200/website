import { useParams } from "next/navigation";

export const useNewsId= () => {
  const params = useParams();
  return params.newsId as string;
};
