import { useParams } from "next/navigation";

export const useStrategicPlanId= () => {
  const params = useParams();
  return params.StrategicPlanId as string;
};
