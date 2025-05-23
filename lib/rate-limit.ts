import { NextRequest, NextResponse } from "next/server"

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute in milliseconds
const MAX_REQUESTS_PER_WINDOW = 100 // Default limit
const AUTH_REQUESTS_PER_WINDOW = 10 // Stricter limit for auth endpoints

// Simple in-memory rate limiting store
// In production, you would use Redis or another distributed store
const rateLimitStore: Record<string, { count: number, timestamp: number }> = {}

/**
 * Rate limiting middleware for Next.js API routes
 * @param req The Next.js request object
 * @param isAuthEndpoint Whether this is an authentication endpoint (stricter limits)
 * @returns Boolean indicating if the request is allowed
 */
export async function rateLimit(req: NextRequest, isAuthEndpoint = false): Promise<boolean> {
  // Get client IP or a unique identifier
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  
  // Use a different key for auth endpoints to have separate limits
  const key = isAuthEndpoint ? `auth:${ip}` : `api:${ip}`
  
  // Initialize or reset if window has passed
  if (!rateLimitStore[key] || now - rateLimitStore[key].timestamp > RATE_LIMIT_WINDOW) {
    rateLimitStore[key] = { count: 1, timestamp: now }
    return true
  }
  
  // Increment count
  rateLimitStore[key].count++
  
  // Check if over limit
  const limit = isAuthEndpoint ? AUTH_REQUESTS_PER_WINDOW : MAX_REQUESTS_PER_WINDOW
  if (rateLimitStore[key].count > limit) {
    return false
  }
  
  return true
}

/**
 * Creates a rate-limited response
 * @returns A 429 Too Many Requests response
 */
export function rateLimitExceededResponse(): NextResponse {
  return NextResponse.json(
    { 
      error: "Too many requests, please try again later",
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000) // seconds
    },
    { 
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil(RATE_LIMIT_WINDOW / 1000))
      }
    }
  )
}

/**
 * Middleware to apply rate limiting to an API route handler
 * @param handler The API route handler
 * @param isAuthEndpoint Whether this is an authentication endpoint (stricter limits)
 * @returns A wrapped handler with rate limiting
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  isAuthEndpoint = false
) {
  return async function(req: NextRequest) {
    const allowed = await rateLimit(req, isAuthEndpoint)
    if (!allowed) {
      return rateLimitExceededResponse()
    }
    return handler(req)
  }
}
