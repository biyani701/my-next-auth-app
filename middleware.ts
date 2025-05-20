import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from "auth"

// Middleware function that adds CORS headers and handles authentication
export async function middleware(request: NextRequest) {
  // Check if the request is for the API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // For API routes, add CORS headers
    const response = NextResponse.next()

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3775')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

    console.log(`[middleware] Added CORS headers for ${request.nextUrl.pathname}`)

    return response
  }

  // For non-API routes, just pass through
  return NextResponse.next()
}

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    // Apply CORS middleware to API routes
    '/api/:path*',
    // Apply auth middleware to all routes except static files
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ],
}
