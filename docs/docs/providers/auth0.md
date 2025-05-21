---
sidebar_position: 3
---

# Auth0 Provider

[Auth0](https://auth0.com/) is a flexible, drop-in solution for adding authentication and authorization services to your applications. This guide explains how to set up Auth0 authentication for your portfolio application.

## Setup

### 1. Create an Auth0 Application

1. Sign up for an Auth0 account or log in to your existing account
2. Go to the [Auth0 Dashboard](https://manage.auth0.com/)
3. Create a new application:
   - Click "Applications" in the sidebar
   - Click "Create Application"
   - Name: Your portfolio app name
   - Application Type: Regular Web Applications
   - Click "Create"
4. In the application settings:
   - Allowed Callback URLs:
     - `http://localhost:3000/api/auth/callback/auth0` (development)
     - `https://my-oauth-proxy.vercel.app/api/auth/callback/auth0` (production)
   - Allowed Logout URLs:
     - `http://localhost:3775` (development)
     - `https://vishal.biyani.xyz` (production)
   - Allowed Web Origins:
     - `http://localhost:3775` (development)
     - `https://vishal.biyani.xyz` (production)
5. Save the changes
6. Note your Domain, Client ID, and Client Secret

### 2. Configure Environment Variables

Add the Auth0 credentials to your `.env.local` file:

```
AUTH_AUTH0_ID=your-auth0-client-id
AUTH_AUTH0_SECRET=your-auth0-client-secret
AUTH_AUTH0_ISSUER=https://your-auth0-domain.auth0.com
```

### 3. Add Auth0 Provider to Auth.js Configuration

In your `auth.ts` file, import and add the Auth0 provider:

```javascript
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

## Usage

### Sign In with Auth0

To sign in with Auth0, redirect the user to the Auth.js sign-in page with the Auth0 provider:

```javascript
import { signIn } from "next-auth/react"

// Redirect to the sign-in page with Auth0 provider
signIn("auth0")

// Or redirect to a specific page after sign-in
signIn("auth0", { callbackUrl: "/dashboard" })
```

### Access Auth0 Profile Data

Auth0 provides profile data that you can access in your Auth.js callbacks:

```javascript
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Providers...
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Save Auth0 profile data in the JWT on the initial sign-in
      if (account && account.provider === "auth0" && profile) {
        token.auth0Profile = profile
      }
      return token
    },
    async session({ session, token }) {
      // Make the Auth0 profile available to the client
      session.auth0Profile = token.auth0Profile
      return session
    },
  },
})
```

## Customizing Auth0

### Adding Social Connections

Auth0 allows you to add social connections to your application, which means users can sign in with various social providers through Auth0:

1. Go to the Auth0 Dashboard
2. Navigate to "Authentication" > "Social"
3. Enable the social connections you want to use (e.g., GitHub, Google, Facebook)
4. Configure the credentials for each social connection

### Customizing the Login Page

Auth0 provides a customizable login page:

1. Go to the Auth0 Dashboard
2. Navigate to "Branding" > "Universal Login"
3. Customize the login page with your branding and design

## Troubleshooting

### Common Issues

1. **Callback URL Mismatch**: Ensure that the callback URL in your Auth0 application settings matches the callback URL used by Auth.js (`http://localhost:3000/api/auth/callback/auth0` for development).

2. **Incorrect Issuer URL**: Make sure the issuer URL is correct. It should be in the format `https://your-auth0-domain.auth0.com`.

3. **CORS Issues**: If you're experiencing CORS errors, check that your Auth0 application has the correct Allowed Web Origins.

### Debugging

To enable debug logging in Auth.js, set the `debug` option to `true`:

```javascript
export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  // Rest of your configuration
})
```
