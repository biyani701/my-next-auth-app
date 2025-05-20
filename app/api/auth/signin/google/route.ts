import { auth, signIn } from "auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signin] GET Provider: google, CallbackUrl: ${callbackUrl}`)

  // We can't modify the response from signIn, so we just return it
  return signIn("google", { redirectTo: callbackUrl })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signin] POST Provider: google, CallbackUrl: ${callbackUrl}`)

  // We can't modify the response from signIn, so we just return it
  return signIn("google", { redirectTo: callbackUrl })
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 })

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3775')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  return response
}
