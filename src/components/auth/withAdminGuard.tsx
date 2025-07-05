"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const ALLOWED_ROLES = ["GENERAL_MANAGER", "NEWS_EDITOR", "REQUEST_REVIEWER"] as const;
type Role = (typeof ALLOWED_ROLES)[number]; // Create a union type of allowed roles

export function withAdminGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const ComponentWithGuard = (props: P) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname(); // Use this to get current path

    useEffect(() => {
      if (status === "loading") return;

      // Not authenticated
      if (!session) {
        // Use the current path for callbackUrl
        signIn(undefined, { callbackUrl: pathname || "/admin" });
        return;
      }

      // Type-safe role check
      const userRole = session.user?.role as Role | undefined;
      if (!userRole || !ALLOWED_ROLES.includes(userRole)) {
        router.replace("/unauthorized");
      }
    }, [session, status, router, pathname]); // Add pathname to dependencies

    if (
      status === "loading" ||
      !session ||
      !session.user?.role ||
      !ALLOWED_ROLES.includes(session.user.role as Role)
    ) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p>Loading authorization...</p>
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