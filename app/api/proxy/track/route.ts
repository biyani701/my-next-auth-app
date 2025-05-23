import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

// Use Node.js runtime for Prisma compatibility
export const runtime = "nodejs"

// Target API URL
const TARGET_API_URL = "https://click-tracker-five.vercel.app/api/track"

/**
 * Proxy endpoint for the click-tracker API
 * This avoids CORS issues by proxying requests through our own backend
 */

// Handle GET requests
export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth()
    
    // Create headers for the forwarded request
    const headers = new Headers()
    
    // Add authorization if we have a session
    if (session?.accessToken) {
      headers.set("Authorization", `Bearer ${session.accessToken}`)
    }
    
    // Forward the request to the target API
    const response = await fetch(TARGET_API_URL, {
      method: "GET",
      headers
    })
    
    // Get the response data
    const data = await response.json()
    
    // Return the response
    return NextResponse.json(data, {
      status: response.status,
      statusText: response.statusText
    })
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json(
      { error: "Failed to proxy request to click-tracker API" },
      { status: 500 }
    )
  }
}

// Handle POST requests
export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth()
    
    // Create headers for the forwarded request
    const headers = new Headers()
    headers.set("Content-Type", "application/json")
    
    // Add authorization if we have a session
    if (session?.accessToken) {
      headers.set("Authorization", `Bearer ${session.accessToken}`)
    }
    
    // Get the request body
    const body = await request.json()
    
    // Forward the request to the target API
    const response = await fetch(TARGET_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    })
    
    // Get the response data
    let data
    try {
      data = await response.json()
    } catch (e) {
      // If the response is not JSON, get it as text
      data = await response.text()
    }
    
    // Return the response
    return NextResponse.json(data, {
      status: response.status,
      statusText: response.statusText
    })
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json(
      { error: "Failed to proxy request to click-tracker API" },
      { status: 500 }
    )
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  })
}
