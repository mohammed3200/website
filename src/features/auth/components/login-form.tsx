"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CredentialsSignIn } from "./credentials-signin";
import { TextShimmer } from "components/motion-primitives/text-shimmer";

export function LoginForm() {
  const [isClient, setIsClient] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [session, status, callbackUrl, router, isClient]);

  if (!isClient || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <TextShimmer className="font-mono text-sm" duration={1}>
          Loading...
        </TextShimmer>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <CredentialsSignIn />
    </div>
  );
}