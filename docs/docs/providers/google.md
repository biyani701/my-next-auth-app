---
sidebar_position: 2
---

# Google Provider

Google is one of the most widely used OAuth providers. This guide explains how to set up Google authentication for your portfolio application.

## Setup

### 1. Create a Google OAuth Client

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Configure the OAuth consent screen:
   - User Type: External
   - App name: Your portfolio app name
   - User support email: Your email
   - Developer contact information: Your email
6. Create the OAuth client ID:
   - Application type: Web application
   - Name: Your portfolio app name
   - Authorized JavaScript origins: 
     - `http://localhost:3775` (development)
     - `https://vishal.biyani.xyz` (production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://my-oauth-proxy.vercel.app/api/auth/callback/google` (production)
7. Click "Create" to get your Client ID and Client Secret

### 2. Configure Environment Variables

Add the Google credentials to your `.env.local` file:

```
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```

### 3. Add Google Provider to Auth.js Configuration

In your `auth.ts` file, import and add the Google provider:

```javascript
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Other providers...
    Google,
  ],
  // ...
})
```

## Usage

### Sign In with Google

To sign in with Google, redirect the user to the Auth.js sign-in page with the Google provider:

```javascript
import { signIn } from "next-auth/react"

// Redirect to the sign-in page with Google provider
signIn("google")

// Or redirect to a specific page after sign-in
signIn("google", { callbackUrl: "/dashboard" })
```

### Access Google Profile Data

Google provides profile data that you can access in your Auth.js callbacks:

```javascript
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Providers...
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Save Google profile data in the JWT on the initial sign-in
      if (account && account.provider === "google" && profile) {
        token.googleProfile = profile
      }
      return token
    },
    async session({ session, token }) {
      // Make the Google profile available to the client
      session.googleProfile = token.googleProfile
      return session
    },
  },
})
```

## Troubleshooting

### Common Issues

1. **Callback URL Mismatch**: Ensure that the callback URL in your Google OAuth client settings matches the callback URL used by Auth.js (`http://localhost:3000/api/auth/callback/google` for development).

2. **Consent Screen Configuration**: Make sure your OAuth consent screen is properly configured. If your app is in "Testing" mode, you'll need to add test users who can access your application.

3. **Scope Issues**: By default, Auth.js requests the `profile` and `email` scopes from Google. If you need additional permissions, you can specify them in the provider configuration:

```javascript
Google({
  clientId: process.env.AUTH_GOOGLE_ID,
  clientSecret: process.env.AUTH_GOOGLE_SECRET,
  authorization: {
    params: {
      scope: 'openid profile email https://www.googleapis.com/auth/calendar',
    },
  },
}),
```

### Debugging

To enable debug logging in Auth.js, set the `debug` option to `true`:

```javascript
export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  // Rest of your configuration
})
```
