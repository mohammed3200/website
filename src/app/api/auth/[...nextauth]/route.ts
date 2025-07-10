// app/api/auth/[...nextauth]/route.ts - Simplified API route
import { handlers } from "@/features/auth/auth";

export const { GET, POST } = handlers;