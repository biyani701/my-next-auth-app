import { auth } from "@/auth"
import { redirect } from "next/navigation"
import RoleConfigContent from "./role-config-content"

// Server component for role checking
export default async function RoleConfigPage() {
  // Check if the user is authenticated and has admin role
  const session = await auth()

  if (!session?.user) {
    redirect("/api/auth/signin")
  }

  if (session.user.role !== "admin") {
    redirect("/access-denied")
  }

  return <RoleConfigContent />
}


