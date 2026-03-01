import type { User, Role, UserInvitation } from '@prisma/client';

export type UserWithRole = Pick<
  User,
  'id' | 'name' | 'email' | 'image' | 'isActive'
> & {
  lastLoginAt: Date | null | undefined; // Adjusting type to match schema if it doesn't exist explicitly, we can fallback
  role: Pick<Role, 'id' | 'name'> | null;
};

// NextAuth updates the user in db on login usually, but let's check schema for lastLoginAt.
// Currently Prisma schema doesn't seem to have `lastLoginAt` on the User model natively.
// We will omit lastLoginAt if not present, and map it.

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
