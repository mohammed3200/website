import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

const handler = NextAuth({
    adapter: PrismaAdapter(db),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Validate credentials exist
                if (!credentials?.email || !credentials.password) return null;

                // Use explicit type for email
                if (typeof credentials.email !== 'string') {
                    throw new Error("Invalid email format");
                }
                const email: string = credentials.email;

                const user = await db.user.findUnique({
                    where: { email: email }  // Now guaranteed to be string
                });

                if (!user) return null;

                // Ensure password exists and is a string
                if (!user.password || typeof user.password !== 'string') {
                    throw new Error("User password not set or invalid");
                }

                // Validate password is string
                if (typeof credentials.password !== 'string') {
                    throw new Error("Invalid password format");
                }
                const password: string = credentials.password;

                const isValid = await bcrypt.compare(
                    password,
                    user.password
                );

                return isValid ? {
                    id: user.id,
                    email: user.email,
                    role: user.role
                } : null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user && user.id !== undefined) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 2 * 60 * 60, // 2 hours
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    secret: process.env.NEXTAUTH_SECRET!,
});

export { handler as GET, handler as POST };