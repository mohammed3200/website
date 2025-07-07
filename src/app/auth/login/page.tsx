"use client";

import { LoginForm } from "@/components/auth/login-form";

export const dynamic = 'force-dynamic'; // Disable prerendering

export default function LoginPage() {
  return <LoginForm />;
}