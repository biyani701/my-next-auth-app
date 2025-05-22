import { auth, signIn } from "../../../.."
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  console.log(`[auth][signin] Provider: google, CallbackUrl: ${callbackUrl}`)

  return signIn("google", { redirectTo: callbackUrl })
}
