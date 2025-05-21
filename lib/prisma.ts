import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

// Check if we're running in production mode
const isProduction = process.env.NODE_ENV === 'production'

// Define a global variable to store the Prisma client instance
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Initialize the Prisma client
export const prisma = globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

// In development, save the client to avoid multiple instances
if (!isProduction) globalForPrisma.prisma = prisma

export default prisma
