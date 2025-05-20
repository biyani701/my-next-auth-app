import { auth, signIn } from "auth"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  
  console.log(`[auth][signin] Provider: github, CallbackUrl: ${callbackUrl}`)
  
  return signIn("github", { redirectTo: callbackUrl })
}
