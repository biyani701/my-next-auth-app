import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Get allowed origins from environment variable
const getAllowedOrigins = (): string[] => {
  const originsEnv = process.env.ALLOWED_ORIGINS || 'http://localhost:3775,https://vishal.biyani.xyz,https://my-next-auth-app-ten.vercel.app,https://my-next-auth-ff7k8dsoq-vishals-projects-d59fa5fe.vercel.app'
  return originsEnv.split(',').map(origin => origin.trim())
}

// Default origin if none is provided
const getDefaultOrigin = (): string => {
  return process.env.DEFAULT_ORIGIN || 'https://vishal.biyani.xyz'
}

// Helper function to handle CORS headers
const setCorsHeaders = (response: NextResponse, origin: string | null): void => {
  const allowedOrigins = getAllowedOrigins()

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization')

  // Set the appropriate origin
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    console.log(`[middleware] Setting Access-Control-Allow-Origin to: ${origin}`)
  } else {
    // If no origin header or not in allowed list, default to the portfolio site
    const defaultOrigin = getDefaultOrigin()
    response.headers.set('Access-Control-Allow-Origin', defaultOrigin)
    console.log(`[middleware] Setting Access-Control-Allow-Origin to default: ${defaultOrigin}`)
  }
}

// Map of legacy routes to their new locations in the (examples) route group
const exampleRoutes: Record<string, string> = {
  '/server-example': '/(examples)/server-example',
  '/client-example': '/(examples)/client-example',
  '/middleware-example': '/(examples)/middleware-example',
  '/api-example': '/(examples)/api-example',
};

// Middleware function that adds CORS headers and handles authentication
export function middleware(request: NextRequest) {
  // Get the origin from the request
  const origin = request.headers.get('origin')
  console.log(`[middleware] Request from origin: ${origin || 'unknown'} for path: ${request.nextUrl.pathname}`)

  // Handle redirects for example routes
  const pathname = request.nextUrl.pathname;
  if (pathname in exampleRoutes) {
    console.log(`[middleware] Redirecting from ${pathname} to ${exampleRoutes[pathname]}`);
    return NextResponse.redirect(new URL(exampleRoutes[pathname], request.url));
  }

  // Handle OPTIONS requests for CORS preflight
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 })
    setCorsHeaders(response, origin)
    console.log(`[middleware] Handled OPTIONS request for ${request.nextUrl.pathname}`)
    return response
  }

  // Check if the request is for the API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // For API routes, add CORS headers
    const response = NextResponse.next()
    setCorsHeaders(response, origin)
    console.log(`[middleware] Added CORS headers for ${request.nextUrl.pathname}`)
    return response
  }

  // For non-API routes, add the pathname to the headers
  const response = NextResponse.next()

  // Add the pathname to the headers for use in components
  response.headers.set('x-pathname', request.nextUrl.pathname)

  return response
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
