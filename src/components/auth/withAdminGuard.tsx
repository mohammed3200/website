"use client";

import { TextShimmer } from "components/motion-primitives/text-shimmer";
import { useSession, signIn } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const ALLOWED_ROLES = [
  "GENERAL_MANAGER",
  "NEWS_EDITOR",
  "REQUEST_REVIEWER",
] as const;
type Role = (typeof ALLOWED_ROLES)[number]; // Add this type definition

export function withAdminGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const ComponentWithGuard = (props: P) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (status === "loading") return;

      if (!session) {
        signIn(undefined, { callbackUrl: pathname || "/admin" });
        return;
      }

      // Type-safe role check
      const userRole = session.user?.role as Role | undefined;
      if (!userRole || !ALLOWED_ROLES.includes(userRole)) {
        router.replace("/unauthorized");
      }
    }, [session, status, router, pathname]);

    if (
      status === "loading" ||
      !session ||
      !session.user?.role ||
      !ALLOWED_ROLES.includes(session.user.role as Role)
    ) {
      return (
        <div className="flex justify-center items-center h-screen bg-dark-100">
          <TextShimmer className="font-mono text-sm" duration={1}>
            Loading authorization...
          </TextShimmer>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  ComponentWithGuard.displayName = `WithAdminGuard(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ComponentWithGuard;
}