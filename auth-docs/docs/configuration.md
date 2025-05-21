---
sidebar_position: 2
---

# Configuration

This page explains how to configure Auth.js V5 for your portfolio project.

## Auth.js Configuration

The main configuration for Auth.js is in the `auth.ts` file at the root of the project. This file defines the authentication providers, callbacks, and other settings.

### Basic Structure

```typescript
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Auth0 from "next-auth/providers/auth0"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub,
    Google,
    Facebook,
    Auth0,
  ],
  callbacks: {
    // Custom callbacks
  },
  pages: {
    // Custom pages
  },
})
```

### Environment Variables

Auth.js requires several environment variables to be set in your `.env.local` file:

```
# Auth.js Secret - Used to encrypt cookies and tokens
AUTH_SECRET=your-secret-key

# Provider Credentials
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret

AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

AUTH_FACEBOOK_ID=your-facebook-client-id
AUTH_FACEBOOK_SECRET=your-facebook-client-secret

AUTH_AUTH0_ID=your-auth0-client-id
AUTH_AUTH0_SECRET=your-auth0-client-secret
AUTH_AUTH0_ISSUER=https://your-auth0-domain.auth0.com
```

## Custom Pages

Auth.js allows you to customize the authentication pages by specifying them in the configuration:

```typescript
export const { handlers, auth, signIn, signOut } = NextAuth({
  // ...
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
})
```

### Sign-In Page

The custom sign-in page is located at `app/auth/signin/page.tsx`. This page displays the available authentication providers with custom styling.

### Error Page

The custom error page is located at `app/auth/error/page.tsx`. This page displays user-friendly error messages for authentication issues.

## CORS Configuration

To enable cross-origin authentication between your authentication server and portfolio client, you need to configure CORS headers. This is done in the route handlers for each provider:

```typescript
// app/api/auth/signin/[provider]/route.ts
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 })

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3775')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  return response
}
```

## Callbacks

Auth.js provides several callback functions that allow you to customize the authentication flow:

### Session Callback

The session callback is used to add custom data to the session object:

```typescript
callbacks: {
  async session({ session, token }) {
    if (token?.accessToken) session.accessToken = token.accessToken
    return session
  },
}
```

### Sign-In Callback

The sign-in callback is used to control whether a user is allowed to sign in:

```typescript
callbacks: {
  async signIn({ user, account }) {
    // Log the sign-in attempt
    console.log("[auth][signIn] Sign-in attempt for:", user?.email, "with provider:", account?.provider)
    
    // Always allow sign-in
    return true
  },
}
```

### JWT Callback

The JWT callback is used to modify the JWT token:

```typescript
callbacks: {
  jwt({ token, trigger, session, account }) {
    if (trigger === "update") token.name = session.user.name
    if (account?.provider === "keycloak") {
      return { ...token, accessToken: account.access_token }
    }
    return token
  },
}
```

## Deployment

The authentication server is deployed on Vercel, while the portfolio client is hosted on GitHub Pages. To deploy your own version:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure the environment variables in Vercel
4. Deploy the application

After deployment, update your portfolio client to use the new authentication server URL.
