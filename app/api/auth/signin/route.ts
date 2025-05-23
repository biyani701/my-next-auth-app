import { signIn } from "../../../.."
import { NextRequest } from "next/server"
import { withRateLimit } from "@/lib/rate-limit"

// Use Node.js runtime for Prisma compatibility
export const runtime = "nodejs"

async function handler(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const provider = searchParams.get("provider") || "github"

  console.log(`[auth][signin] GET Provider: ${provider}, CallbackUrl: ${callbackUrl}`)

  // Sign in with the specified provider (defaults to GitHub)
  return signIn(provider, { redirectTo: callbackUrl })
}

// Apply rate limiting to the signin route
export const GET = withRateLimit(handler, true)

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const provider = searchParams.get("provider") || "github"

  console.log(`[auth][signin] POST Provider: ${provider}, CallbackUrl: ${callbackUrl}`)

  return signIn(provider, { redirectTo: callbackUrl })
}
