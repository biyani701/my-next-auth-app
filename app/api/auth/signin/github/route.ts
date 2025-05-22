import { auth, signIn } from "../../../../.."
import { NextRequest, NextResponse } from "next/server"

// Use Node.js runtime for Prisma compatibility
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signin] GET Provider: github, CallbackUrl: ${callbackUrl}`)

  // We can't modify the response from signIn, so we just return it
  return signIn("github", { redirectTo: callbackUrl })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signin] POST Provider: github, CallbackUrl: ${callbackUrl}`)

  // We can't modify the response from signIn, so we just return it
  return signIn("github", { redirectTo: callbackUrl })
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 })

  // Get the origin from the request
  const origin = request.headers.get('origin')
  console.log(`[github] OPTIONS request from origin: ${origin || 'unknown'}`)

  // Determine the allowed origin
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3775,https://vishal.biyani.xyz')
    .split(',').map(o => o.trim())

  const allowedOrigin = origin && allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0]

  console.log(`[github] OPTIONS using origin: ${allowedOrigin}`)

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization')

  return response
}
