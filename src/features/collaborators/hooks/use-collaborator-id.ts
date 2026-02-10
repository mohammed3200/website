import { useParams } from "next/navigation";

export const useCollaboratorId = () => {
    const params = useParams();
    return params.collaboratorId as string;
}