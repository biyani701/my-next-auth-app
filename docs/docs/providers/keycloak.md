---
sidebar_position: 5
---

# Keycloak Provider

[Keycloak](https://www.keycloak.org/) is an open-source identity and access management solution that provides single sign-on with identity and access management.

## Setup

### 1. Create a Keycloak Realm and Client

1. Log in to your Keycloak admin console
2. Create a new realm (or use an existing one)
3. Create a new client:
   - Client ID: `my-next-auth-app`
   - Client Protocol: `openid-connect`
   - Access Type: `confidential`
   - Valid Redirect URIs: `http://localhost:3000/api/auth/callback/keycloak`
4. After saving, go to the "Credentials" tab to get the client secret

### 2. Configure Environment Variables

Add the Keycloak credentials to your `.env.local` file:

```
AUTH_KEYCLOAK_ID=my-next-auth-app
AUTH_KEYCLOAK_SECRET=your-client-secret
AUTH_KEYCLOAK_ISSUER=http://localhost:9090/realms/your-realm
```

### 3. Add Keycloak Provider to Auth.js Configuration

In your `auth.ts` file, import and add the Keycloak provider:

```javascript
import Keycloak from "next-auth/providers/keycloak"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Other providers...
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER,
    }),
  ],
  // ...
})
```

## Usage

### Sign In with Keycloak

To sign in with Keycloak, redirect the user to the Auth.js sign-in page with the Keycloak provider:

```javascript
import { signIn } from "next-auth/react"

// Redirect to the sign-in page with Keycloak provider
signIn("keycloak")

// Or redirect to a specific page after sign-in
signIn("keycloak", { callbackUrl: "/dashboard" })
```

### Access Token

Keycloak provides an access token that can be used to make authenticated requests to your backend services. You can access this token in your Auth.js callbacks:

```javascript
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Providers...
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Save the access token and refresh token in the JWT on the initial sign-in
      if (account && account.provider === "keycloak") {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.idToken = account.id_token
        token.expiresAt = account.expires_at
      }
      return token
    },
    async session({ session, token }) {
      // Make the token available to the client
      session.accessToken = token.accessToken
      return session
    },
  },
})
```

## Testing with Keycloak

For testing purposes, you can run Keycloak locally using Docker:

```bash
docker run -p 9090:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
```

Then, create a test user in your realm and use it for automated tests.

## Troubleshooting

### Common Issues

1. **Redirect URI Mismatch**: Ensure that the redirect URI in your Keycloak client settings matches the callback URL used by Auth.js (`http://localhost:3000/api/auth/callback/keycloak`).

2. **CORS Errors**: If you're experiencing CORS errors, make sure your Keycloak server allows requests from your application's domain.

3. **Token Validation Errors**: Ensure that the issuer URL is correct and includes the realm name.

### Debugging

To enable debug logging in Auth.js, set the `debug` option to `true`:

```javascript
export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  // Rest of your configuration
})
```
