// auth.ts - Single source of truth for NextAuth configuration
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { db } from "@/lib/db";
import { LoginSchema } from "@/features/auth/schemas"; // Use consistent import path
import { getUserByEmail } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "@/data/account";
import { comparePassword } from "@/lib/auth"; // Use your custom compare function
import { getUserPermissions } from "@/lib/rbac";

export const {
  handlers,
  auth,
  signIn,
  signOut,
  unstable_update
} = NextAuth({
  // Cast to any to bypass type mismatch due to Prisma 7 adapter patterns
  adapter: PrismaAdapter(db as any),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await comparePassword(password, user.password);

          if (passwordsMatch) return user;
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    }
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as string;
        session.user.roleName = token.roleName as string;
      }

      if (token.permissions && session.user) {
        session.user.permissions = token.permissions as any;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email || "";
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.isActive = token.isActive as boolean;
      }

      return session;
    },

    async jwt({ token, user, trigger }) {
      // Handle initial sign in
      if (user && user.id !== undefined) {
        token.id = user.id;
      }

      if (!token.sub) return token;

      // Always fetch fresh user data
      const existingUser = await db.user.findUnique({
        where: { id: token.sub },
        include: {
          role: true,
        },
      });

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      // Get user permissions
      const permissions = await getUserPermissions(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.roleId = existingUser.roleId;
      token.roleName = existingUser.role?.name;
      token.permissions = permissions;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.isActive = existingUser.isActive;

      // Update last login time on sign in
      if (trigger === "signIn") {
        await db.user.update({
          where: { id: existingUser.id },
          data: { lastLoginAt: new Date() },
        });
      }

      return token;
    },

    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await db.user.findUnique({
        where: { id: user.id },
        include: { role: true },
      });

      if (!existingUser) return false;

      // Check if user is active
      if (!existingUser.isActive) {
        throw new Error("Your account has been deactivated. Please contact an administrator.");
      }

      // Prevent sign in without email verification
      if (!existingUser.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) return false;

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours
  },
  secret: process.env.NEXTAUTH_SECRET!,
});

// For API routes
export const { GET, POST } = handlers;