"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import { Role, hasRole } from "@/lib/auth-utils";

interface RoleGuardProps {
  requiredRole: Role;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A component that only renders its children if the user has the required role
 */
export function RoleGuard({ requiredRole, children, fallback = null }: RoleGuardProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role as Role | undefined;
  
  if (!session || !hasRole(userRole, requiredRole)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * A component that renders different content based on the user's role
 */
export function RoleSwitch({ 
  cases,
  fallback = null 
}: { 
  cases: { role: Role; content: ReactNode }[];
  fallback?: ReactNode;
}) {
  const { data: session } = useSession();
  const userRole = session?.user?.role as Role | undefined;
  
  if (!session || !userRole) {
    return <>{fallback}</>;
  }
  
  // Find the highest role the user has access to
  for (const { role, content } of cases) {
    if (hasRole(userRole, role)) {
      return <>{content}</>;
    }
  }
  
  return <>{fallback}</>;
}
