import { auth } from "../../../../auth"
import { prisma } from "../../../../lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// Use Node.js runtime for Prisma compatibility
export const runtime = "nodejs"

/**
 * Development-only API route to make the current user an admin
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
  
  // Check if the user is authenticated
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "You must be signed in to use this endpoint" },
      { status: 401 }
    )
  }
  
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, role: true }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    
    // Update the user's role to admin
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: "admin" },
      select: { id: true, email: true, role: true }
    })
    
    return NextResponse.json({
      success: true,
      message: "User role updated to admin",
      user: updatedUser
    })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    )
  }
}
