import { auth, signOut } from "auth"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  
  console.log(`[auth][signout] CallbackUrl: ${callbackUrl}`)
  
  return signOut({ redirectTo: callbackUrl })
}
