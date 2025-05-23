# Role-Based Authentication

This guide explains how to use role-based authentication in your Next.js application with Auth.js v5.

## Overview

Role-based authentication allows you to control access to different parts of your application based on user roles. This application supports three built-in roles:

- **user**: Basic authenticated user (default)
- **moderator**: Can access moderator features
- **admin**: Can access all features, including admin dashboard

## How It Works

### User Model

The role is stored in the `User` model in the database:

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          String    @default("user") // Possible values: "user", "admin", "moderator"
  accounts      Account[]
  sessions      Session[]
}
```

### Role Hierarchy

The application implements a role hierarchy where higher roles have access to all features available to lower roles:

```typescript
// Role hierarchy (from highest to lowest)
// - admin: Can access all pages
// - moderator: Can access moderator pages and user pages
// - user: Can access only user pages

const roleHierarchy: Record<Role, number> = {
  "admin": 3,
  "moderator": 2,
  "user": 1
};
```

## Protecting Routes

### Server-Side Protection

For server components and API routes, use the `requireRole` function:

```typescript
import { requireRole } from "@/lib/auth-utils";

export default async function AdminPage() {
  // This will redirect if the user is not an admin
  const session = await requireRole("admin");
  
  // Your protected component code here
}
```

### Client-Side Protection

For client components, use the `RoleGuard` component:

```tsx
import { RoleGuard } from "@/components/role-guard";

export default function MyComponent() {
  return (
    <RoleGuard 
      requiredRole="moderator" 
      fallback={<p>You don't have access to this content</p>}
    >
      <div>This content is only visible to moderators and admins</div>
    </RoleGuard>
  );
}
```

### Middleware Protection

The application also uses Auth.js middleware to protect routes based on roles:

```typescript
// In auth.ts
callbacks: {
  authorized({ request, auth }) {
    const { pathname } = request.nextUrl

    // Require admin role for admin pages
    if (pathname.startsWith("/admin")) {
      return auth?.user?.role === "admin"
    }

    // Require moderator or admin role for moderator pages
    if (pathname.startsWith("/moderator")) {
      return ["admin", "moderator"].includes(auth?.user?.role as string)
    }

    // Allow access to all other pages
    return true
  },
}
```

## Managing User Roles

### Admin Dashboard

Administrators can manage user roles through the admin dashboard at `/admin`. The dashboard provides a user management interface where admins can:

1. View all users
2. Change user roles
3. Search and filter users

### Programmatic Role Updates

You can also update roles programmatically using the Admin API:

```typescript
// Example: Update a user's role
const response = await fetch("/api/admin/users", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ 
    userId: "user_id_here", 
    role: "moderator" 
  })
});
```

## Session and JWT Handling

When a user signs in, their role is added to the JWT token and session:

```typescript
// In auth.ts
callbacks: {
  async jwt({ token, user }) {
    // If this is the first sign in, add the user's role to the token
    if (user) {
      token.role = user.role;
    }
    return token
  },
  async session({ session, token }) {
    // Add role to the session
    if (token?.role) session.user.role = token.role;
    return session
  },
}
```

## TypeScript Integration

The application extends Auth.js types to include the role:

```typescript
declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }

  interface User {
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
  }
}
```

## Best Practices

1. **Always check roles on the server**: Even if you have client-side role checks, always verify roles on the server for security.

2. **Use the role hierarchy**: When checking if a user has access, use the `hasRole` function to respect the role hierarchy.

3. **Don't expose sensitive operations**: Even with role checks, avoid exposing sensitive operations in client-side code.

4. **Audit role changes**: Keep track of role changes for security auditing.

5. **Consider custom roles**: For more complex applications, you might want to implement a more flexible permission system with custom roles.
