---
sidebar_position: 4
---

# Auth0 Authentication

This guide explains how to set up Auth0 authentication for your portfolio project.

## Prerequisites

- An Auth0 account

## Setting Up Auth0

### 1. Create an Auth0 Application

1. Sign in to your [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** > **Applications**
3. Click **Create Application**
4. Enter a name for your application (e.g., "Portfolio Authentication")
5. Select **Regular Web Applications**
6. Click **Create**
7. In the application settings:
   - **Allowed Callback URLs**: Add your auth server callback URL (e.g., `https://auth.vishal.biyani.xyz/api/auth/callback/auth0`)
   - **Allowed Logout URLs**: Add your portfolio URL (e.g., `https://vishal.biyani.xyz`)
   - **Allowed Web Origins**: Add your portfolio URL (e.g., `https://vishal.biyani.xyz`)
8. Click **Save Changes**
9. Note your **Domain**, **Client ID**, and **Client Secret**

### 2. Configure Environment Variables

Add the Auth0 credentials to your `.env.local` file:

```
AUTH_AUTH0_ID=your-auth0-client-id
AUTH_AUTH0_SECRET=your-auth0-client-secret
AUTH_AUTH0_ISSUER=https://your-auth0-domain.auth0.com
```

### 3. Add Auth0 Provider to Auth.js Configuration

In your `auth.ts` file, import and add the Auth0 provider:

```typescript
import Auth0 from "next-auth/providers/auth0"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Other providers...
    Auth0({
      clientId: process.env.AUTH_AUTH0_ID,
      clientSecret: process.env.AUTH_AUTH0_SECRET,
      issuer: process.env.AUTH_AUTH0_ISSUER,
    }),
  ],
  // ...
})
```

### 4. Create Auth0 Route Handler

Create a route handler for Auth0 authentication at `app/api/auth/signin/auth0/route.ts`:

```typescript
import { auth, signIn } from "auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signin] GET Provider: auth0, CallbackUrl: ${callbackUrl}`)

  // We can't modify the response from signIn, so we just return it
  return signIn("auth0", { redirectTo: callbackUrl })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signin] POST Provider: auth0, CallbackUrl: ${callbackUrl}`)

  // We can't modify the response from signIn, so we just return it
  return signIn("auth0", { redirectTo: callbackUrl })
}

// Handle OPTIONS requests for CORS preflight
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

## Testing Auth0 Authentication

1. Start your authentication server:
   ```bash
   npm run dev
   ```

2. Navigate to your sign-in page (e.g., `http://localhost:3000/auth/signin`)

3. Click the **Continue with Auth0** button

4. You should be redirected to Auth0's login page

5. After authenticating, you should be redirected back to your application with an active session

## Troubleshooting

### Common Issues

1. **Callback URL Mismatch**: Ensure the callback URL in your Auth0 application settings exactly matches the one in your Auth.js configuration.

2. **Invalid Client ID or Secret**: Double-check that your environment variables are correctly set and that the client ID and secret are valid.

3. **Incorrect Issuer URL**: Make sure the issuer URL in your environment variables is correct and includes the full domain (e.g., `https://your-auth0-domain.auth0.com`).

4. **CORS Issues**: If you're experiencing CORS errors, make sure the CORS headers in the route handler are correctly configured for your portfolio domain.

### Debugging

Enable debug mode in your Auth.js configuration to get more detailed logs:

```typescript
export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  // ...
})
```
