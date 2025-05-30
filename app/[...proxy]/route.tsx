import { auth } from "../.."
import { NextRequest } from "next/server"

// Review if we need this, and why
function stripContentEncoding(result: Response) {
  const responseHeaders = new Headers(result.headers)
  responseHeaders.delete("content-encoding")

  return new Response(result.body, {
    status: result.status,
    statusText: result.statusText,
    headers: responseHeaders,
  })
}

async function handler(request: NextRequest) {
  const session = await auth()

  const headers = new Headers(request.headers)
  headers.set("Authorization", `Bearer ${session?.accessToken}`)

  let backendUrl =
    process.env.THIRD_PARTY_API_EXAMPLE_BACKEND ??
    "https://third-party-backend.authjs.dev"

  let url = request.nextUrl.href.replace(request.nextUrl.origin, backendUrl)

  // Only include body for methods that support it (not GET or HEAD)
  const method = request.method.toUpperCase()
  const fetchOptions: RequestInit = {
    headers,
    method
  }

  // Only add body for methods that support it
  if (method !== 'GET' && method !== 'HEAD' && request.body) {
    fetchOptions.body = request.body
  }

  let result = await fetch(url, fetchOptions)

  return stripContentEncoding(result)
}

export const dynamic = "force-dynamic"

export { handler as GET, handler as POST }
