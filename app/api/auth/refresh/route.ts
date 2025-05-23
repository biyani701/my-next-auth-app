import { auth } from "../../../../auth"
import { prisma } from "../../../../lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// Use Node.js runtime for Prisma compatibility
export const runtime = "nodejs"

/**
 * API route to refresh the session with the latest user data from the database
 * This is useful when the user's role has been updated in the database
 * but the session still has the old role
 */
export async function GET(req: NextRequest) {
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
      select: { 
        id: true, 
        email: true, 
        role: true,
        name: true,
        image: true
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    
    // Check if the role in the database is different from the role in the session
    const roleChanged = user.role !== session.user.role
    
    return NextResponse.json({
      success: true,
      message: roleChanged 
        ? "Session needs to be updated with the latest role" 
        : "Session already has the latest role",
      currentSession: {
        role: session.user.role
      },
      databaseUser: {
        role: user.role
      },
      roleChanged
    })
  } catch (error) {
    console.error("Error checking user role:", error)
    return NextResponse.json(
      { error: "Failed to check user role" },
      { status: 500 }
    )
  }
}
