---
sidebar_position: 2
---

# Authentication Providers

Auth.js supports multiple authentication providers to give your users flexibility in how they sign in to your application. This page documents the providers configured for your portfolio application.

## Available Providers

<div className="row">
  <div className="col col--4">
    <div className="card provider-card">
      <img src="/docs/img/providers/github.svg" alt="GitHub Logo" />
      <h3>GitHub</h3>
      <p>Sign in with your GitHub account</p>
      <a href="/docs/providers/github" className="button button--primary">Learn More</a>
    </div>
  </div>
  <div className="col col--4">
    <div className="card provider-card">
      <img src="/docs/img/providers/google.svg" alt="Google Logo" />
      <h3>Google</h3>
      <p>Sign in with your Google account</p>
      <a href="/docs/providers/google" className="button button--primary">Learn More</a>
    </div>
  </div>
  <div className="col col--4">
    <div className="card provider-card">
      <img src="/docs/img/providers/auth0.svg" alt="Auth0 Logo" />
      <h3>Auth0</h3>
      <p>Sign in with your Auth0 account</p>
      <a href="/docs/providers/auth0" className="button button--primary">Learn More</a>
    </div>
  </div>
</div>

<div className="row" style={{marginTop: '20px'}}>
  <div className="col col--4">
    <div className="card provider-card">
      <img src="/docs/img/providers/facebook.svg" alt="Facebook Logo" />
      <h3>Facebook</h3>
      <p>Sign in with your Facebook account</p>
      <a href="/docs/providers/facebook" className="button button--primary">Learn More</a>
    </div>
  </div>
  <div className="col col--4">
    <div className="card provider-card">
      <img src="/docs/img/providers/keycloak.svg" alt="Keycloak Logo" />
      <h3>Keycloak</h3>
      <p>Sign in with your Keycloak account</p>
      <a href="/docs/providers/keycloak" className="button button--primary">Learn More</a>
    </div>
  </div>
  <div className="col col--4">
    <div className="card provider-card">
      <img src="/docs/img/providers/credentials.svg" alt="Credentials Logo" />
      <h3>Credentials</h3>
      <p>Sign in with email and password</p>
      <a href="/docs/providers/credentials" className="button button--primary">Learn More</a>
    </div>
  </div>
</div>

## Adding a New Provider

To add a new authentication provider to your application, follow these steps:

1. **Install the provider package** (if needed)
2. **Configure environment variables** in `.env.local`
3. **Add the provider to your Auth.js configuration**

### Example: Adding a New Provider

Here's an example of how to add a new provider to your Auth.js configuration:

```javascript
// In auth.ts
import NewProvider from "next-auth/providers/new-provider"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Existing providers...
    NewProvider({
      clientId: process.env.NEW_PROVIDER_ID,
      clientSecret: process.env.NEW_PROVIDER_SECRET,
      // Additional provider-specific options
    }),
  ],
  // Rest of your configuration
})
```

## Provider Configuration

Each provider requires specific environment variables to be set in your `.env.local` file. Refer to the individual provider documentation for details on the required variables.

## Provider Callbacks

Auth.js allows you to customize the behavior of providers through callbacks. These are defined in your Auth.js configuration:

```javascript
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Your providers...
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Custom sign-in logic
      return true
    },
    // Other callbacks...
  },
})
```
