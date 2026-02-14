import {
  Innovator as PrismaInnovator,
  Collaborator as PrismaCollaborator,
} from '@prisma/client';

export type Innovator = PrismaInnovator;
export type Collaborator = PrismaCollaborator;

export interface AdminActionProps {
  id: string;
  type: 'innovator' | 'collaborator';
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (id: string) => void;
}
