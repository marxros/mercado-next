"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/providers/AuthProvider";

type RequireAuthProps = {
  children: ReactNode;
  allowedRoles?: Array<"ADMIN" | "PRODUCER" | "DELIVERER" | "CONSUMER">;
  fallbackHref?: string;
};

export function RequireAuth({ children, allowedRoles, fallbackHref = "/login" }: RequireAuthProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(fallbackHref);
      return;
    }
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, allowedRoles, user, router, fallbackHref]);

  if (isLoading) return null;
  if (!isAuthenticated) return null;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}


