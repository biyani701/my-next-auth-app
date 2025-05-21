import { auth } from "auth"
import { NextResponse } from "next/server"

// Use Node.js runtime for Prisma compatibility
export const runtime = "nodejs"

// Get allowed origins from environment variable
const getAllowedOrigins = (): string[] => {
  const originsEnv = process.env.ALLOWED_ORIGINS || 'http://localhost:3775,https://vishal.biyani.xyz'
  return originsEnv.split(',').map(origin => origin.trim())
}

// Helper function to set CORS headers
const setCorsHeaders = (response: NextResponse, origin: string | null): void => {
  const allowedOrigins = getAllowedOrigins()

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization')

  // Set the appropriate origin
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    console.log(`[session] Setting Access-Control-Allow-Origin to: ${origin}`)
  } else {
    // If no origin header or not in allowed list, default to the first allowed origin
    const defaultOrigin = allowedOrigins[0]
    response.headers.set('Access-Control-Allow-Origin', defaultOrigin)
    console.log(`[session] Setting Access-Control-Allow-Origin to default: ${defaultOrigin}`)
  }
}

export async function GET(request: Request) {
  const session = await auth()

  // Get the origin from the request
  const origin = request.headers.get('origin')
  console.log(`[session] Request from origin: ${origin || 'unknown'}`)

  // Create the response
  const response = NextResponse.json(session)

  // Add CORS headers
  setCorsHeaders(response, origin)

  return response
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: Request) {
  const response = new NextResponse(null, { status: 204 })

  // Get the origin from the request
  const origin = request.headers.get('origin')
  console.log(`[session] OPTIONS request from origin: ${origin || 'unknown'}`)

  // Add CORS headers
  setCorsHeaders(response, origin)

  return response
}
