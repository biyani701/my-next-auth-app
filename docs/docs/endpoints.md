---
sidebar_position: 3
---

# Auth.js Endpoints

Auth.js provides several endpoints for authentication operations. This page documents the available endpoints and their usage.

## Authentication Endpoints

<table className="endpoints-table">
  <thead>
    <tr>
      <th>Endpoint</th>
      <th>Method</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/api/auth/signin</code></td>
      <td><span className="method-badge method-get">GET</span></td>
      <td>Displays the sign-in page with all configured providers</td>
    </tr>
    <tr>
      <td><code>/api/auth/signin/:provider</code></td>
      <td><span className="method-badge method-post">POST</span></td>
      <td>Initiates sign-in with the specified provider</td>
    </tr>
    <tr>
      <td><code>/api/auth/callback/:provider</code></td>
      <td><span className="method-badge method-get">GET</span></td>
      <td>Callback URL for OAuth providers to return to after authentication</td>
    </tr>
    <tr>
      <td><code>/api/auth/signout</code></td>
      <td><span className="method-badge method-get">GET</span></td>
      <td>Displays the sign-out page</td>
    </tr>
    <tr>
      <td><code>/api/auth/signout</code></td>
      <td><span className="method-badge method-post">POST</span></td>
      <td>Signs the user out and invalidates their session</td>
    </tr>
    <tr>
      <td><code>/api/auth/session</code></td>
      <td><span className="method-badge method-get">GET</span></td>
      <td>Returns the current session data</td>
    </tr>
    <tr>
      <td><code>/api/auth/csrf</code></td>
      <td><span className="method-badge method-get">GET</span></td>
      <td>Returns a CSRF token for form submissions</td>
    </tr>
    <tr>
      <td><code>/api/auth/providers</code></td>
      <td><span className="method-badge method-get">GET</span></td>
      <td>Returns a list of configured providers</td>
    </tr>
  </tbody>
</table>

## Session Management

Auth.js uses JWT (JSON Web Tokens) for session management. The session can be accessed in your application using the `useSession` hook or the `getServerSession` function.

### Client-Side Session Access

```javascript
import { useSession } from "next-auth/react"

export default function Component() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "authenticated") {
    return <p>Signed in as {session.user.email}</p>
  }

  return <p>Not signed in</p>
}
```

### Server-Side Session Access

```javascript
import { getServerSession } from "next-auth"
import { auth } from "@/auth"

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.auth)

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
```

## CORS Configuration

When using Auth.js with a separate frontend application, you need to configure CORS to allow cross-origin requests. This is done in the `next.config.js` file:

```javascript
/** @type {import("next").NextConfig} */
module.exports = {
  async headers() {
    return [
      {
        source: '/api/auth/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'https://your-frontend-domain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version' },
        ],
      },
    ]
  },
}
```
