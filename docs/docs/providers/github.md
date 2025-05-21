---
sidebar_position: 1
---

# GitHub Provider

GitHub is one of the most popular OAuth providers for developer-focused applications. This guide explains how to set up GitHub authentication for your portfolio application.

## Setup

### 1. Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on "New OAuth App"
3. Fill in the application details:
   - **Application name**: Your portfolio app name
   - **Homepage URL**: `http://localhost:3775` (development) or `https://vishal.biyani.xyz` (production)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github` (development) or `https://my-oauth-proxy.vercel.app/api/auth/callback/github` (production)
4. Click "Register application"
5. After creating the app, you'll see your Client ID
6. Generate a new Client Secret

### 2. Configure Environment Variables

Add the GitHub credentials to your `.env.local` file:

```
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret
```

### 3. Add GitHub Provider to Auth.js Configuration

In your `auth.ts` file, import and add the GitHub provider:

```javascript
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Other providers...
    GitHub,
  ],
  // ...
})
```

## Usage

### Sign In with GitHub

To sign in with GitHub, redirect the user to the Auth.js sign-in page with the GitHub provider:

```javascript
import { signIn } from "next-auth/react"

// Redirect to the sign-in page with GitHub provider
signIn("github")

// Or redirect to a specific page after sign-in
signIn("github", { callbackUrl: "/dashboard" })
```

### Access GitHub Profile Data

GitHub provides profile data that you can access in your Auth.js callbacks:

```javascript
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Providers...
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Save GitHub profile data in the JWT on the initial sign-in
      if (account && account.provider === "github" && profile) {
        token.githubProfile = profile
      }
      return token
    },
    async session({ session, token }) {
      // Make the GitHub profile available to the client
      session.githubProfile = token.githubProfile
      return session
    },
  },
})
```

## Troubleshooting

### Common Issues

1. **Callback URL Mismatch**: Ensure that the callback URL in your GitHub OAuth app settings matches the callback URL used by Auth.js (`http://localhost:3000/api/auth/callback/github` for development).

2. **Rate Limiting**: GitHub has rate limits for API requests. If you're experiencing issues, check if you've hit these limits.

3. **Scope Issues**: By default, Auth.js requests the `read:user` and `user:email` scopes from GitHub. If you need additional permissions, you can specify them in the provider configuration:

```javascript
GitHub({
  clientId: process.env.AUTH_GITHUB_ID,
  clientSecret: process.env.AUTH_GITHUB_SECRET,
  authorization: {
    params: {
      scope: 'read:user user:email repo',
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
