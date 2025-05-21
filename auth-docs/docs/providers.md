---
sidebar_position: 3
---

# Authentication Providers

This page provides an overview of the authentication providers used in the portfolio project.

## Supported Providers

The portfolio authentication system currently supports the following OAuth providers:

| Provider | Documentation | Setup Guide |
|----------|--------------|-------------|
| GitHub   | [GitHub OAuth](https://docs.github.com/en/developers/apps/building-oauth-apps) | [Setup Guide](/providers/github) |
| Google   | [Google OAuth](https://developers.google.com/identity/protocols/oauth2) | [Setup Guide](/providers/google) |
| Facebook | [Facebook OAuth](https://developers.facebook.com/docs/facebook-login/) | [Setup Guide](/providers/facebook) |
| Auth0    | [Auth0 OAuth](https://auth0.com/docs/authenticate) | [Setup Guide](/providers/auth0) |

## Provider Configuration

Each provider is configured in the `auth.ts` file with its own credentials:

```typescript
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
    Auth0({
      clientId: process.env.AUTH_AUTH0_ID,
      clientSecret: process.env.AUTH_AUTH0_SECRET,
      issuer: process.env.AUTH_AUTH0_ISSUER,
    }),
  ],
  // ...
})
```

## Provider Route Handlers

Each provider has its own route handler in the `app/api/auth/signin/[provider]/route.ts` file. These handlers manage the authentication flow for each provider.

For example, the GitHub provider route handler:

```typescript
// app/api/auth/signin/github/route.ts
import { auth, signIn } from "auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signin] GET Provider: github, CallbackUrl: ${callbackUrl}`)

  // We can't modify the response from signIn, so we just return it
  return signIn("github", { redirectTo: callbackUrl })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signin] POST Provider: github, CallbackUrl: ${callbackUrl}`)

  // We can't modify the response from signIn, so we just return it
  return signIn("github", { redirectTo: callbackUrl })
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

## UI Components

The authentication UI is customized to display provider-specific buttons with appropriate styling and icons. This is implemented in the `components/provider-buttons.tsx` file.

## Adding New Providers

To add a new authentication provider, follow the [Adding New Providers](/providers/adding-new-providers) guide.
