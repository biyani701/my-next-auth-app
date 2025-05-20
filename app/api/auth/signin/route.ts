import { auth, signIn } from "auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signin] GET CallbackUrl: ${callbackUrl}`)

  // Directly sign in with GitHub provider to avoid redirect loops
  return signIn("github", { redirectTo: callbackUrl })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const provider = searchParams.get("provider") || "github"

  console.log(`[auth][signin] POST Provider: ${provider}, CallbackUrl: ${callbackUrl}`)

  return signIn(provider, { redirectTo: callbackUrl })
}
