import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Roles hierarchy (from highest to lowest)
 * - admin: Can access all pages
 * - moderator: Can access moderator pages and user pages
 * - user: Can access only user pages
 */
export type Role = "admin" | "moderator" | "user";

/**
 * Check if a user has a specific role or higher
 * @param userRole The user's role
 * @param requiredRole The required role
 * @returns True if the user has the required role or higher
 */
export function hasRole(userRole: string | undefined, requiredRole: Role): boolean {
  if (!userRole) return false;

  // Role hierarchy
  const roleHierarchy: Record<Role, number> = {
    "admin": 3,
    "moderator": 2,
    "user": 1
  };

  // Get the numeric values for the roles
  const userRoleValue = roleHierarchy[userRole as Role] || 0;
  const requiredRoleValue = roleHierarchy[requiredRole];

  // Check if the user's role is high enough
  return userRoleValue >= requiredRoleValue;
}

/**
 * Server action to check if the current user has a specific role
 * @param requiredRole The required role
 * @param redirectTo Where to redirect if the user doesn't have the required role
 */
export async function requireRole(requiredRole: Role, redirectTo: string = "/access-denied") {
  const session = await auth();

  // Debug logging
  console.log(`[auth-utils] requireRole: Checking for role ${requiredRole}`);
  console.log(`[auth-utils] requireRole: Session:`, session);

  if (!session || !session.user) {
    console.log(`[auth-utils] requireRole: No session or user, redirecting to signin`);
    redirect("/api/auth/signin");
  }

  const userRole = session.user.role as Role | undefined;
  console.log(`[auth-utils] requireRole: User role is ${userRole || 'undefined'}`);

  if (!hasRole(userRole, requiredRole)) {
    console.log(`[auth-utils] requireRole: User does not have required role, redirecting to ${redirectTo}`);
    redirect(redirectTo);
  }

  console.log(`[auth-utils] requireRole: User has required role, allowing access`);
  return session;
}

/**
 * Client-side hook to check if the current user has a specific role
 * This is a placeholder - in a real app, you would use a React hook
 * that accesses the session from the client side
 */
export function useHasRole(requiredRole: Role): boolean {
  // This is just a placeholder - in a real app, you would use
  // the useSession hook from next-auth/react
  return true;
}
