import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// Log database connection information in development
if (process.env.NODE_ENV === 'development') {
  console.log('[prisma] Database connection initialized');
  console.log('[prisma] Connection pooling is handled automatically by Prisma');
}

// Keep a single instance of Prisma Client in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
