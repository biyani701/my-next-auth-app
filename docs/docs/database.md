# Database Configuration

This guide explains how to configure and use a database with Auth.js v5 in your Next.js application.

## PostgreSQL with Prisma

This application is configured to use PostgreSQL with Prisma as the database adapter for Auth.js. This provides persistent storage for user accounts, sessions, and other authentication data.

### Prerequisites

- A PostgreSQL database (we're using Neon PostgreSQL)
- The database connection string in the format: `postgres://username:password@host:port/database?sslmode=require`

### Configuration

1. **Set up your database connection**

   Add your PostgreSQL connection string to your `.env.local` file:

   ```
   DATABASE_URL=postgres://username:password@host:port/database?sslmode=require
   ```

   For Vercel deployment, add the `DATABASE_URL` environment variable in your Vercel project settings.

2. **Generate the Prisma client**

   After setting up your database connection, generate the Prisma client:

   ```bash
   npm run prisma:generate
   ```

3. **Push the schema to your database**

   To create the necessary tables in your database:

   ```bash
   npm run prisma:push
   ```

### How It Works

The application is configured to use the Prisma adapter when `DATABASE_URL` is set, otherwise it falls back to the Unstorage adapter:

```javascript
// In auth.ts
adapter: process.env.DATABASE_URL
  ? (() => {
      console.log('[auth] Using database storage with Prisma adapter');
      return PrismaAdapter(prisma);
    })()
  : (() => {
      console.log('[auth] Using memory storage (no database configuration found)');
      return UnstorageAdapter(storage);
    })(),
```

## Session Strategy

You can choose between JWT (stateless) or database (stateful) session strategies by setting the `SESSION_STRATEGY` environment variable:

```
# In .env.local
SESSION_STRATEGY=database  # Options: jwt, database
```

If not specified, the default is JWT. The configuration in `auth.ts` looks like this:

```javascript
session: {
  strategy: (process.env.SESSION_STRATEGY === "database" ? "database" : "jwt")
},
```

## Connection Pooling

Prisma automatically handles connection pooling for optimal database performance. The connection pool is managed internally by Prisma, which:

1. Creates a pool of connections to the database
2. Reuses connections to reduce overhead
3. Handles connection timeouts and errors
4. Scales the pool based on demand

The Prisma client is configured in `lib/prisma.ts`:

```javascript
// Create Prisma client
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
```

### Connection Pool Configuration

Prisma's connection pool can be configured through environment variables:

```
# Database connection pool configuration
DATABASE_CONNECTION_LIMIT=5  # Maximum number of connections (default: 10)
DATABASE_POOL_TIMEOUT=10     # Connection timeout in seconds (default: 10)
```

For more information on Prisma's connection management, see the [Prisma documentation](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-management).

## Rate Limiting

To protect your database from excessive load, the application includes rate limiting for authentication endpoints and admin APIs. The rate limiting is implemented in `lib/rate-limit.ts` and applied to sensitive routes.

Rate limits are:
- 10 requests per minute for authentication endpoints
- 100 requests per minute for general API endpoints

## Session Cleanup and Data Retention

The application includes a session cleanup mechanism to remove expired sessions and tokens. This helps maintain database performance and comply with data retention policies.

You can configure retention periods with these environment variables:

```
# Data retention configuration (in days)
SESSION_RETENTION_DAYS=30
ACCOUNT_RETENTION_DAYS=365
VERIFICATION_TOKEN_RETENTION_DAYS=7
```

Administrators can manually trigger cleanup from the admin dashboard or set up a scheduled task to run the cleanup API endpoint:

```
POST /api/admin/cleanup
```

### Vercel Deployment

When deploying to Vercel, the build process automatically:

1. Checks if `DATABASE_URL` is set
2. Generates the Prisma client if needed
3. Uses the Node.js runtime for API routes to ensure Prisma compatibility

### Troubleshooting

If you encounter issues with Prisma on Vercel:

1. **Check your environment variables**: Make sure `DATABASE_URL` is correctly set in your Vercel project settings.
2. **Verify connection pooling**: Excessive connections might cause database errors. Try reducing `DB_CONNECTION_LIMIT`.
3. **Check for expired sessions**: A large number of expired sessions can slow down your application. Run the cleanup process from the admin dashboard.

2. **Verify the database connection**: Test your database connection string locally before deploying.

3. **Check build logs**: Look for any Prisma-related errors in the Vercel build logs.

4. **Regenerate Prisma client**: If you've made changes to your Prisma schema, make sure to regenerate the client before deploying.

## Alternative Storage Options

If you don't want to use PostgreSQL, Auth.js supports various other storage options:

- **Vercel KV**: Configure `AUTH_KV_REST_API_URL` and `AUTH_KV_REST_API_TOKEN` in your environment variables.
- **Memory Storage**: Used automatically as a fallback when no database is configured (not recommended for production).
- **Other Databases**: Auth.js supports many other databases through different adapters. See the [Auth.js documentation](https://authjs.dev/reference/core/adapters) for more information.
