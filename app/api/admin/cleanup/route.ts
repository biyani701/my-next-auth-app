import { auth } from "../../../../auth"
import { prisma } from "../../../../lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// Use Node.js runtime for Prisma compatibility
export const runtime = "nodejs"

// Default retention periods (in days)
const DEFAULT_SESSION_RETENTION_DAYS = 30
const DEFAULT_ACCOUNT_RETENTION_DAYS = 365
const DEFAULT_VERIFICATION_TOKEN_RETENTION_DAYS = 7

/**
 * Cleanup API route for removing expired sessions and tokens
 * This can be called manually by admins or set up as a cron job
 */
export async function POST(req: NextRequest) {
  // Check authentication and authorization
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
  
  try {
    // Parse request body for custom retention periods
    const body = await req.json().catch(() => ({}))
    
    // Get retention periods from request or use defaults
    const sessionRetentionDays = body.sessionRetentionDays || 
      parseInt(process.env.SESSION_RETENTION_DAYS || '', 10) || 
      DEFAULT_SESSION_RETENTION_DAYS
    
    const accountRetentionDays = body.accountRetentionDays || 
      parseInt(process.env.ACCOUNT_RETENTION_DAYS || '', 10) || 
      DEFAULT_ACCOUNT_RETENTION_DAYS
    
    const verificationTokenRetentionDays = body.verificationTokenRetentionDays || 
      parseInt(process.env.VERIFICATION_TOKEN_RETENTION_DAYS || '', 10) || 
      DEFAULT_VERIFICATION_TOKEN_RETENTION_DAYS
    
    // Calculate cutoff dates
    const sessionCutoff = new Date()
    sessionCutoff.setDate(sessionCutoff.getDate() - sessionRetentionDays)
    
    const accountCutoff = new Date()
    accountCutoff.setDate(accountCutoff.getDate() - accountRetentionDays)
    
    const verificationTokenCutoff = new Date()
    verificationTokenCutoff.setDate(verificationTokenCutoff.getDate() - verificationTokenRetentionDays)
    
    // Delete expired sessions
    const deletedSessions = await prisma.session.deleteMany({
      where: {
        expires: {
          lt: new Date() // Delete sessions that have already expired
        }
      }
    })
    
    // Delete old sessions (based on retention period)
    const deletedOldSessions = await prisma.session.deleteMany({
      where: {
        expires: {
          lt: sessionCutoff // Delete sessions older than retention period
        }
      }
    })
    
    // Delete expired verification tokens
    const deletedVerificationTokens = await prisma.verificationToken.deleteMany({
      where: {
        expires: {
          lt: new Date() // Delete tokens that have already expired
        }
      }
    })
    
    // Delete old verification tokens (based on retention period)
    const deletedOldVerificationTokens = await prisma.verificationToken.deleteMany({
      where: {
        expires: {
          lt: verificationTokenCutoff // Delete tokens older than retention period
        }
      }
    })
    
    // Return cleanup results
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      deleted: {
        expiredSessions: deletedSessions.count,
        oldSessions: deletedOldSessions.count,
        expiredVerificationTokens: deletedVerificationTokens.count,
        oldVerificationTokens: deletedOldVerificationTokens.count
      },
      retentionPeriods: {
        sessionRetentionDays,
        accountRetentionDays,
        verificationTokenRetentionDays
      }
    })
  } catch (error) {
    console.error("Error during cleanup:", error)
    return NextResponse.json(
      { error: "Failed to perform cleanup" },
      { status: 500 }
    )
  }
}

// GET endpoint to check cleanup status and configuration
export async function GET(req: NextRequest) {
  // Check authentication and authorization
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
  
  try {
    // Count expired sessions
    const expiredSessionsCount = await prisma.session.count({
      where: {
        expires: {
          lt: new Date()
        }
      }
    })
    
    // Count expired verification tokens
    const expiredVerificationTokensCount = await prisma.verificationToken.count({
      where: {
        expires: {
          lt: new Date()
        }
      }
    })
    
    // Get retention periods from environment or use defaults
    const sessionRetentionDays = 
      parseInt(process.env.SESSION_RETENTION_DAYS || '', 10) || 
      DEFAULT_SESSION_RETENTION_DAYS
    
    const accountRetentionDays = 
      parseInt(process.env.ACCOUNT_RETENTION_DAYS || '', 10) || 
      DEFAULT_ACCOUNT_RETENTION_DAYS
    
    const verificationTokenRetentionDays = 
      parseInt(process.env.VERIFICATION_TOKEN_RETENTION_DAYS || '', 10) || 
      DEFAULT_VERIFICATION_TOKEN_RETENTION_DAYS
    
    // Return cleanup status
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      expired: {
        sessions: expiredSessionsCount,
        verificationTokens: expiredVerificationTokensCount
      },
      retentionPeriods: {
        sessionRetentionDays,
        accountRetentionDays,
        verificationTokenRetentionDays
      },
      cleanupUrl: `${req.nextUrl.origin}/api/admin/cleanup`
    })
  } catch (error) {
    console.error("Error checking cleanup status:", error)
    return NextResponse.json(
      { error: "Failed to check cleanup status" },
      { status: 500 }
    )
  }
}
