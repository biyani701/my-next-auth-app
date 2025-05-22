import { auth } from "../../.."

// Use Node.js runtime for Prisma compatibility
export const runtime = "nodejs"

export const GET = auth((req) => {
  if (req.auth) {
    return Response.json({ data: "Protected data" })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
})
