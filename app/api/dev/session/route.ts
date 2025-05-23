import { auth } from "../../../../auth"
import { NextRequest, NextResponse } from "next/server"

// Use Node.js runtime for Prisma compatibility
export const runtime = "nodejs"

/**
 * Development-only API route to check the current session
 * This should NOT be used in production
 */
export async function GET(req: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This endpoint is only available in development mode" },
      { status: 403 }
    )
  }
  
  // Get the current session
  const session = await auth()
  
  return NextResponse.json({
    authenticated: !!session,
    session
  })
}
