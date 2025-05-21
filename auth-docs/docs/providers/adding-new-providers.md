---
sidebar_position: 5
---

# Adding New Providers

This guide explains how to add new authentication providers to your portfolio project.

## Overview

Auth.js supports a wide range of authentication providers. This guide will walk you through the process of adding a new provider to your portfolio authentication system.

## Step 1: Choose a Provider

Auth.js supports many providers out of the box. You can find the full list in the [Auth.js documentation](https://authjs.dev/getting-started/providers).

Some popular providers include:
- Twitter
- LinkedIn
- Apple
- Discord
- Twitch
- Spotify
- and many more...

## Step 2: Register with the Provider

Each provider has its own registration process. Generally, you'll need to:

1. Create a developer account with the provider
2. Register a new application
3. Configure the callback URL (usually in the format `https://your-auth-server.com/api/auth/callback/provider-id`)
4. Obtain client ID and client secret credentials

## Step 3: Add Environment Variables

Add the provider credentials to your `.env.local` file:

```
AUTH_PROVIDER_ID=your-provider-client-id
AUTH_PROVIDER_SECRET=your-provider-client-secret
# Some providers require additional configuration
AUTH_PROVIDER_ISSUER=https://your-provider-issuer.com
```

Replace `PROVIDER` with the name of your provider (e.g., `TWITTER`, `LINKEDIN`).

## Step 4: Update Auth.js Configuration

In your `auth.ts` file, import and add the new provider:

```typescript
import Provider from "next-auth/providers/provider-name"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Existing providers...
    Provider({
      clientId: process.env.AUTH_PROVIDER_ID,
      clientSecret: process.env.AUTH_PROVIDER_SECRET,
      // Additional provider-specific configuration
    }),
  ],
  // ...
})
```

## Step 5: Create Provider Route Handler

Create a route handler for the new provider at `app/api/auth/signin/provider-id/route.ts`:

```typescript
import { auth, signIn } from "auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signin] GET Provider: provider-id, CallbackUrl: ${callbackUrl}`)

  // We can't modify the response from signIn, so we just return it
  return signIn("provider-id", { redirectTo: callbackUrl })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signin] POST Provider: provider-id, CallbackUrl: ${callbackUrl}`)

  // We can't modify the response from signIn, so we just return it
  return signIn("provider-id", { redirectTo: callbackUrl })
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

Replace `provider-id` with the ID of your provider (e.g., `twitter`, `linkedin`).

## Step 6: Add Provider Button to UI

Update the sign-in UI to include a button for the new provider. This involves:

1. Adding the provider to the `ProviderButtons` component in `components/provider-buttons.tsx`:

```typescript
// Add to ProviderIcons
const ProviderIcons = {
  // Existing icons...
  newProvider: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2">
      {/* Provider-specific SVG path */}
    </svg>
  ),
}

// Add to ProviderStyles
const ProviderStyles = {
  // Existing styles...
  newProvider: "bg-[#PROVIDER_COLOR] hover:bg-[#PROVIDER_HOVER_COLOR] text-white",
}

// Add to providers array
const providers = [
  // Existing providers...
  { id: "provider-id", name: "Provider Name" },
]
```

2. Adding the provider to the server-side sign-in components in `app/auth/signin/page.tsx` and `app/page.tsx`:

```tsx
<SignIn provider="provider-id">
  <div className="flex items-center justify-center py-3">
    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2">
      {/* Provider-specific SVG path */}
    </svg>
    Continue with Provider Name
  </div>
</SignIn>
```

## Step 7: Test the New Provider

1. Start your authentication server:
   ```bash
   npm run dev
   ```

2. Navigate to your sign-in page (e.g., `http://localhost:3000/auth/signin`)

3. Click the button for your new provider

4. You should be redirected to the provider's authorization page

5. After authorizing, you should be redirected back to your application with an active session

## Example: Adding Twitter Provider

Here's a complete example of adding Twitter (X) as a provider:

### Environment Variables

```
AUTH_TWITTER_ID=your-twitter-client-id
AUTH_TWITTER_SECRET=your-twitter-client-secret
```

### Auth.js Configuration

```typescript
import Twitter from "next-auth/providers/twitter"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Existing providers...
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID,
      clientSecret: process.env.AUTH_TWITTER_SECRET,
      version: "2.0", // Use OAuth 2.0
    }),
  ],
  // ...
})
```

### Route Handler

```typescript
// app/api/auth/signin/twitter/route.ts
import { auth, signIn } from "auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signin] GET Provider: twitter, CallbackUrl: ${callbackUrl}`)

  return signIn("twitter", { redirectTo: callbackUrl })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signin] POST Provider: twitter, CallbackUrl: ${callbackUrl}`)

  return signIn("twitter", { redirectTo: callbackUrl })
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 })
  
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3775')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  return response
}
```

### UI Component

```tsx
<SignIn provider="twitter">
  <div className="flex items-center justify-center py-3">
    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2">
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
    Continue with X
  </div>
</SignIn>
```
