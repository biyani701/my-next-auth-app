---
sidebar_position: 2
---

# Google Authentication

This guide explains how to set up Google OAuth authentication for your portfolio project.

## Prerequisites

- A Google account
- A Google Cloud Platform project

## Setting Up Google OAuth

### 1. Create a Google Cloud Platform Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Your Portfolio Authentication
   - User support email: Your email
   - Developer contact information: Your email
   - Authorized domains: Your domain (e.g., `vishal.biyani.xyz`)
6. For the OAuth client ID, select **Web application**
7. Add a name for your client (e.g., "Portfolio Authentication")
8. Add authorized JavaScript origins:
   - Your auth server origin (e.g., `https://auth.vishal.biyani.xyz`)
   - Your portfolio origin (e.g., `https://vishal.biyani.xyz`)
9. Add authorized redirect URIs:
   - Your auth server callback URL (e.g., `https://auth.vishal.biyani.xyz/api/auth/callback/google`)
10. Click **Create**
11. Note your **Client ID** and **Client Secret**

### 2. Configure Environment Variables

Add the Google OAuth credentials to your `.env.local` file:

```
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```

### 3. Add Google Provider to Auth.js Configuration

In your `auth.ts` file, import and add the Google provider:

```typescript
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Other providers...
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  // ...
})
```

### 4. Create Google Route Handler

Create a route handler for Google authentication at `app/api/auth/signin/google/route.ts`:

```typescript
import { auth, signIn } from "auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signin] GET Provider: google, CallbackUrl: ${callbackUrl}`)

  // We can't modify the response from signIn, so we just return it
  return signIn("google", { redirectTo: callbackUrl })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signin] POST Provider: google, CallbackUrl: ${callbackUrl}`)

  // We can't modify the response from signIn, so we just return it
  return signIn("google", { redirectTo: callbackUrl })
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

## Testing Google Authentication

1. Start your authentication server:
   ```bash
   npm run dev
   ```

2. Navigate to your sign-in page (e.g., `http://localhost:3000/auth/signin`)

3. Click the **Continue with Google** button

4. You should be redirected to Google's authorization page

5. After authorizing, you should be redirected back to your application with an active session

## Troubleshooting

### Common Issues

1. **Callback URL Mismatch**: Ensure the callback URL in your Google Cloud Console exactly matches the one in your Auth.js configuration.

2. **Invalid Client ID or Secret**: Double-check that your environment variables are correctly set and that the client ID and secret are valid.

3. **OAuth Consent Screen Configuration**: Make sure your OAuth consent screen is properly configured and published.

4. **CORS Issues**: If you're experiencing CORS errors, make sure the CORS headers in the route handler are correctly configured for your portfolio domain.

### Debugging

Enable debug mode in your Auth.js configuration to get more detailed logs:

```typescript
export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  // ...
})
```
