import { auth } from "../../../../auth"
import { prisma } from "../../../../lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// Use Node.js runtime for Prisma compatibility
export const runtime = "nodejs"

/**
 * Development-only API route to update a user's role
 * This should NOT be used in production
 */
export async function POST(req: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This endpoint is only available in development mode" },
      { status: 403 }
    )
  }
  
  try {
    const body = await req.json()
    const { email, role } = body
    
    // Validate input
    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      )
    }
    
    // Validate role
    const validRoles = ["user", "moderator", "admin"]
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be one of: user, moderator, admin" },
        { status: 400 }
      )
    }
    
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    
    // Update the user's role
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role },
      select: { id: true, email: true, role: true }
    })
    
    return NextResponse.json({
      success: true,
      message: `User role updated from ${user.role} to ${role}`,
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
