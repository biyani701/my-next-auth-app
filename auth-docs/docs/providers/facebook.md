---
sidebar_position: 3
---

# Facebook Authentication

This guide explains how to set up Facebook OAuth authentication for your portfolio project.

## Prerequisites

- A Facebook account
- A Facebook Developer account

## Setting Up Facebook OAuth

### 1. Create a Facebook App

1. Go to the [Facebook Developer Portal](https://developers.facebook.com/)
2. Click **My Apps** > **Create App**
3. Select **Consumer** as the app type
4. Enter your app name and contact email
5. Click **Create App**
6. In the app dashboard, navigate to **Add Products to Your App**
7. Find **Facebook Login** and click **Set Up**
8. Select **Web** as the platform
9. Enter your website URL (e.g., `https://vishal.biyani.xyz`)
10. Click **Save**
11. Navigate to **Settings** > **Basic** to find your **App ID** and **App Secret**
12. Navigate to **Facebook Login** > **Settings**
13. Add your OAuth Redirect URI (e.g., `https://auth.vishal.biyani.xyz/api/auth/callback/facebook`)
14. Click **Save Changes**

### 2. Configure Environment Variables

Add the Facebook OAuth credentials to your `.env.local` file:

```
AUTH_FACEBOOK_ID=your-facebook-app-id
AUTH_FACEBOOK_SECRET=your-facebook-app-secret
```

### 3. Add Facebook Provider to Auth.js Configuration

In your `auth.ts` file, import and add the Facebook provider:

```typescript
import Facebook from "next-auth/providers/facebook"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Other providers...
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
  ],
  // ...
})
```

### 4. Create Facebook Route Handler

Create a route handler for Facebook authentication at `app/api/auth/signin/facebook/route.ts`:

```typescript
import { auth, signIn } from "auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signin] GET Provider: facebook, CallbackUrl: ${callbackUrl}`)

  // We can't modify the response from signIn, so we just return it
  return signIn("facebook", { redirectTo: callbackUrl })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signin] POST Provider: facebook, CallbackUrl: ${callbackUrl}`)

  // We can't modify the response from signIn, so we just return it
  return signIn("facebook", { redirectTo: callbackUrl })
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

## Testing Facebook Authentication

1. Start your authentication server:
   ```bash
   npm run dev
   ```

2. Navigate to your sign-in page (e.g., `http://localhost:3000/auth/signin`)

3. Click the **Continue with Facebook** button

4. You should be redirected to Facebook's authorization page

5. After authorizing, you should be redirected back to your application with an active session

## Troubleshooting

### Common Issues

1. **App Review Required**: Some Facebook permissions require app review. For basic authentication, you should be able to use the default permissions without review.

2. **Callback URL Mismatch**: Ensure the callback URL in your Facebook Developer Portal exactly matches the one in your Auth.js configuration.

3. **Invalid Client ID or Secret**: Double-check that your environment variables are correctly set and that the client ID and secret are valid.

4. **CORS Issues**: If you're experiencing CORS errors, make sure the CORS headers in the route handler are correctly configured for your portfolio domain.

### Debugging

Enable debug mode in your Auth.js configuration to get more detailed logs:

```typescript
export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  // ...
})
```
