---
sidebar_position: 1
---

# GitHub Authentication

This guide explains how to set up GitHub OAuth authentication for your portfolio project.

## Prerequisites

- A GitHub account
- A registered GitHub OAuth application

## Setting Up GitHub OAuth

### 1. Create a GitHub OAuth Application

1. Go to your GitHub account settings
2. Navigate to **Developer settings** > **OAuth Apps** > **New OAuth App**
3. Fill in the application details:
   - **Application name**: Your Portfolio Authentication
   - **Homepage URL**: Your portfolio URL (e.g., `https://vishal.biyani.xyz`)
   - **Authorization callback URL**: Your auth server callback URL (e.g., `https://auth.vishal.biyani.xyz/api/auth/callback/github`)
4. Click **Register application**
5. After registration, you'll see your **Client ID**
6. Generate a new **Client Secret** by clicking **Generate a new client secret**

### 2. Configure Environment Variables

Add the GitHub OAuth credentials to your `.env.local` file:

```
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret
```

### 3. Add GitHub Provider to Auth.js Configuration

In your `auth.ts` file, import and add the GitHub provider:

```typescript
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    // Other providers...
  ],
  // ...
})
```

### 4. Create GitHub Route Handler

Create a route handler for GitHub authentication at `app/api/auth/signin/github/route.ts`:

```typescript
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

## Testing GitHub Authentication

1. Start your authentication server:
   ```bash
   npm run dev
   ```

2. Navigate to your sign-in page (e.g., `http://localhost:3000/auth/signin`)

3. Click the **Continue with GitHub** button

4. You should be redirected to GitHub's authorization page

5. After authorizing, you should be redirected back to your application with an active session

## Troubleshooting

### Common Issues

1. **Callback URL Mismatch**: Ensure the callback URL in your GitHub OAuth application settings exactly matches the one in your Auth.js configuration.

2. **Invalid Client ID or Secret**: Double-check that your environment variables are correctly set and that the client ID and secret are valid.

3. **CORS Issues**: If you're experiencing CORS errors, make sure the CORS headers in the route handler are correctly configured for your portfolio domain.

### Debugging

Enable debug mode in your Auth.js configuration to get more detailed logs:

```typescript
export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  // ...
})
```
