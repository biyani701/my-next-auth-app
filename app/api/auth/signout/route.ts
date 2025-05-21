import { signOut } from "auth"
import { NextRequest, NextResponse } from "next/server"

// Use Node.js runtime for Prisma compatibility
export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signout] CallbackUrl: ${callbackUrl}`)

  // Get the origin from the request
  const origin = request.headers.get('origin')
  console.log(`[signout] Request from origin: ${origin || 'unknown'}`)

  // Determine the allowed origin
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3775,https://vishal.biyani.xyz')
    .split(',').map(o => o.trim())

  const allowedOrigin = origin && allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0]

  console.log(`[signout] Using origin: ${allowedOrigin}`)

  // Create a response with CORS headers
  const corsResponse = new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    }
  })

  // Call signOut to clear the session
  await signOut({ redirectTo: callbackUrl })

  return corsResponse
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 })

  // Get the origin from the request
  const origin = request.headers.get('origin')
  console.log(`[signout] OPTIONS request from origin: ${origin || 'unknown'}`)

  // Determine the allowed origin
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3775,https://vishal.biyani.xyz')
    .split(',').map(o => o.trim())

  const allowedOrigin = origin && allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0]

  console.log(`[signout] OPTIONS using origin: ${allowedOrigin}`)

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization')

  return response
}
