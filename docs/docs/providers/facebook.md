---
sidebar_position: 4
---

# Facebook Provider

Facebook is one of the most popular social login providers. This guide explains how to set up Facebook authentication for your portfolio application.

## Setup

### 1. Create a Facebook App

1. Go to the [Facebook Developers](https://developers.facebook.com/) website
2. Click "My Apps" and then "Create App"
3. Select "Consumer" as the app type
4. Fill in the app details and create the app
5. In the app dashboard, add the "Facebook Login" product
6. Configure the Facebook Login settings:
   - Valid OAuth Redirect URIs:
     - `http://localhost:3000/api/auth/callback/facebook` (development)
     - `https://my-oauth-proxy.vercel.app/api/auth/callback/facebook` (production)
7. Note your App ID and App Secret from the app dashboard

### 2. Configure Environment Variables

Add the Facebook credentials to your `.env.local` file:

```
AUTH_FACEBOOK_ID=your-facebook-app-id
AUTH_FACEBOOK_SECRET=your-facebook-app-secret
```

### 3. Add Facebook Provider to Auth.js Configuration

In your `auth.ts` file, import and add the Facebook provider:

```javascript
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

## Usage

### Sign In with Facebook

To sign in with Facebook, redirect the user to the Auth.js sign-in page with the Facebook provider:

```javascript
import { signIn } from "next-auth/react"

// Redirect to the sign-in page with Facebook provider
signIn("facebook")

// Or redirect to a specific page after sign-in
signIn("facebook", { callbackUrl: "/dashboard" })
```

### Access Facebook Profile Data

Facebook provides profile data that you can access in your Auth.js callbacks:

```javascript
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Providers...
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Save Facebook profile data in the JWT on the initial sign-in
      if (account && account.provider === "facebook" && profile) {
        token.facebookProfile = profile
      }
      return token
    },
    async session({ session, token }) {
      // Make the Facebook profile available to the client
      session.facebookProfile = token.facebookProfile
      return session
    },
  },
})
```

## Additional Permissions

By default, Auth.js requests the `email` and `public_profile` permissions from Facebook. If you need additional permissions, you can specify them in the provider configuration:

```javascript
Facebook({
  clientId: process.env.AUTH_FACEBOOK_ID,
  clientSecret: process.env.AUTH_FACEBOOK_SECRET,
  authorization: {
    params: {
      scope: 'email public_profile user_friends',
    },
  },
}),
```

## App Review

If you're using permissions beyond `email` and `public_profile`, you'll need to submit your app for review by Facebook. This process involves:

1. Providing detailed information about how your app uses the requested permissions
2. Creating a screencast demonstrating the user flow
3. Submitting the app for review

## Troubleshooting

### Common Issues

1. **Callback URL Mismatch**: Ensure that the callback URL in your Facebook app settings matches the callback URL used by Auth.js (`http://localhost:3000/api/auth/callback/facebook` for development).

2. **App in Development Mode**: By default, Facebook apps in development mode can only be used by app admins, developers, and testers. To allow public access, you need to make your app public.

3. **Missing Profile Fields**: If you're not receiving certain profile fields, make sure you've requested the appropriate permissions and that your app has been approved for those permissions.

### Debugging

To enable debug logging in Auth.js, set the `debug` option to `true`:

```javascript
export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  // Rest of your configuration
})
```
