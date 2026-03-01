import type { User, Role, UserInvitation } from '@prisma/client';

export type UserWithRole = Pick<
  User,
  'id' | 'name' | 'email' | 'image' | 'isActive'
> & {
  lastLoginAt?: Date | null;
  role: Pick<Role, 'id' | 'name'> | null;
};

export type InvitationWithRole = UserInvitation & {
  role: Pick<Role, 'id' | 'name'>;
  inviter: Pick<User, 'id' | 'name' | 'email'>;
};

export interface UserListResponse {
  data: UserWithRole[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface InvitationListResponse {
  data: InvitationWithRole[];
}
