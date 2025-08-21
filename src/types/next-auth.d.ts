// src/types/next-auth.d.ts
import "next-auth";
import { DefaultSession } from "next-auth";

interface Permission {
  resource: string;
  action: string;
}

declare module "next-auth"  {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
      roleId?: string | null;
      roleName?: string;
      permissions?: Permission[];
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
      isActive: boolean;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    roleId?: string | null;
    isActive?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roleId?: string | null;
    roleName?: string;
    permissions?: Permission[];
    isTwoFactorEnabled?: boolean;
    isOAuth?: boolean;
    isActive?: boolean;
  }
}
