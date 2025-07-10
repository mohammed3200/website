"use client";

import { TextShimmer } from "components/motion-primitives/text-shimmer";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function CallbackComponent() {
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
    } else if (status === "unauthenticated") {
      router.push("/auth/error");
    }
  }, [session, status, router, callbackUrl, isClient]);

  if (!isClient || status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-dark-100">
        <TextShimmer className="font-mono text-sm" duration={1}>
          Loading...
        </TextShimmer>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-dark-100">
      <TextShimmer className="font-mono text-sm" duration={1}>
        Processing authentication...
      </TextShimmer>
    </div>
  );
}