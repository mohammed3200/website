"use client";

import { CallbackComponent } from "@/components/auth/callback-component";

export const dynamic = 'force-dynamic'; // Disable prerendering

export default function CallbackPage() {
  return <CallbackComponent />;
}