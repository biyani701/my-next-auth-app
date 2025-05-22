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
adapter: process.env.DATABASE_URL ? PrismaAdapter(prisma) : UnstorageAdapter(storage),
```

### Vercel Deployment

When deploying to Vercel, the build process automatically:

1. Checks if `DATABASE_URL` is set
2. Generates the Prisma client if needed
3. Uses the Node.js runtime for API routes to ensure Prisma compatibility

### Troubleshooting

If you encounter issues with Prisma on Vercel:

1. **Check your environment variables**: Make sure `DATABASE_URL` is correctly set in your Vercel project settings.

2. **Verify the database connection**: Test your database connection string locally before deploying.

3. **Check build logs**: Look for any Prisma-related errors in the Vercel build logs.

4. **Regenerate Prisma client**: If you've made changes to your Prisma schema, make sure to regenerate the client before deploying.

## Alternative Storage Options

If you don't want to use PostgreSQL, Auth.js supports various other storage options:

- **Vercel KV**: Configure `AUTH_KV_REST_API_URL` and `AUTH_KV_REST_API_TOKEN` in your environment variables.
- **Memory Storage**: Used automatically as a fallback when no database is configured (not recommended for production).
- **Other Databases**: Auth.js supports many other databases through different adapters. See the [Auth.js documentation](https://authjs.dev/reference/core/adapters) for more information.
