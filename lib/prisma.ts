import { PrismaClient } from '@prisma/client'

/**
 * PrismaClient is attached to the `global` object in development to prevent
 * exhausting your database connection limit.
 * Learn more: https://pris.ly/d/help/next-js-best-practices
 */

// Declare global variable for TypeScript
declare global {
  var prisma: PrismaClient | undefined
}

// Initialize the Prisma client
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// In development, save the client to avoid multiple instances
if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma
