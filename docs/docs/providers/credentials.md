---
sidebar_position: 6
---

# Credentials Provider

The Credentials provider allows you to handle sign-in with username/password or other credentials. It's particularly useful for testing and for integrating with existing authentication systems.

## Setup

### 1. Add Credentials Provider to Auth.js Configuration

In your `auth.ts` file, import and add the Credentials provider:

```javascript
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Other providers...
    Credentials({
      // The name to display on the sign-in form
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign-in page
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Add your own logic here to validate credentials
        // Return null if credentials are invalid
        // Return a user object if credentials are valid
        if (credentials?.email === "test@example.com" && credentials?.password === "password") {
          return {
            id: "1",
            name: "Test User",
            email: "test@example.com",
          };
        }
        return null;
      }
    }),
  ],
  // ...
})
```

## Usage

### Sign In with Credentials

To sign in with credentials, redirect the user to the Auth.js sign-in page with the credentials provider:

```javascript
import { signIn } from "next-auth/react"

// Redirect to the sign-in page with credentials provider
signIn("credentials")

// Or sign in programmatically with credentials
signIn("credentials", {
  email: "test@example.com",
  password: "password",
  redirect: false,
}).then((result) => {
  if (result.ok) {
    // Signed in successfully
    window.location.href = "/dashboard";
  } else {
    // Sign-in failed
    console.error("Sign-in failed:", result.error);
  }
});
```

## Integrating with Existing Authentication Systems

The Credentials provider can be used to integrate with existing authentication systems:

```javascript
Credentials({
  name: "Existing System",
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" }
  },
  async authorize(credentials) {
    // Make a request to your authentication API
    const res = await fetch("https://your-api.com/auth", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" }
    });
    const user = await res.json();
    
    // If the API returned a user, return it
    if (res.ok && user) {
      return user;
    }
    
    // If the API returned an error, return null
    return null;
  }
}),
```

## Security Considerations

When using the Credentials provider, keep these security considerations in mind:

1. **Store Passwords Securely**: Never store passwords in plain text. Use a secure hashing algorithm like bcrypt.

2. **Implement Rate Limiting**: Prevent brute force attacks by implementing rate limiting on sign-in attempts.

3. **Use HTTPS**: Always use HTTPS to encrypt credentials in transit.

4. **Consider Two-Factor Authentication**: For additional security, consider implementing two-factor authentication.

## Testing with Credentials Provider

The Credentials provider is useful for testing authentication flows:

```javascript
// In your test file
import { signIn } from "next-auth/react"

// Sign in with test credentials
await signIn("credentials", {
  email: "test@example.com",
  password: "password",
  redirect: false,
});

// Now you can test authenticated functionality
```

## Troubleshooting

### Common Issues

1. **Session Not Persisting**: By default, the Credentials provider uses JWT for session management. Make sure you've configured the `session` strategy correctly.

2. **CSRF Protection**: Auth.js includes CSRF protection for form submissions. Make sure you're including the CSRF token in your sign-in requests.

3. **Redirect Issues**: If you're having issues with redirects, try using `redirect: false` in the `signIn` function and handle the redirect manually.

### Debugging

To enable debug logging in Auth.js, set the `debug` option to `true`:

```javascript
export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  // Rest of your configuration
})
```
