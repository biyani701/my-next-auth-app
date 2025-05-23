import { auth } from "../../../../auth"
import { prisma } from "../../../../lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// Use Node.js runtime for Prisma compatibility
export const runtime = "nodejs"

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute in milliseconds
const MAX_REQUESTS_PER_WINDOW = 10

// Simple in-memory rate limiting store
// In production, you would use Redis or another distributed store
const rateLimitStore: Record<string, { count: number, timestamp: number }> = {}

// Rate limiting middleware
async function rateLimit(req: NextRequest) {
  // Get client IP or a unique identifier
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  
  // Initialize or reset if window has passed
  if (!rateLimitStore[ip] || now - rateLimitStore[ip].timestamp > RATE_LIMIT_WINDOW) {
    rateLimitStore[ip] = { count: 1, timestamp: now }
    return true
  }
  
  // Increment count
  rateLimitStore[ip].count++
  
  // Check if over limit
  if (rateLimitStore[ip].count > MAX_REQUESTS_PER_WINDOW) {
    return false
  }
  
  return true
}

// GET all users (with pagination)
export async function GET(req: NextRequest) {
  // Check authentication and authorization
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
  
  // Apply rate limiting
  const allowed = await rateLimit(req)
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests, please try again later" },
      { status: 429 }
    )
  }
  
  try {
    // Parse query parameters
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    
    // Get users with pagination
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        emailVerified: true,
        _count: {
          select: {
            accounts: true,
            sessions: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    // Get total count for pagination
    const total = await prisma.user.count()
    
    return NextResponse.json({
      users,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

// PATCH to update a user's role
export async function PATCH(req: NextRequest) {
  // Check authentication and authorization
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
  
  // Apply rate limiting
  const allowed = await rateLimit(req)
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests, please try again later" },
      { status: 429 }
    )
  }
  
  try {
    const body = await req.json()
    const { userId, role } = body
    
    // Validate input
    if (!userId || !role) {
      return NextResponse.json(
        { error: "User ID and role are required" },
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
    
    // Prevent changing your own role (security measure)
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot change your own role" },
        { status: 400 }
      )
    }
    
    // Update the user's role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })
    
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    )
  }
}
