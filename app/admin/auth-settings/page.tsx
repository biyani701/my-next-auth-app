import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AuthSettingsContent from "./auth-settings-content"

// Server component for role checking
export default async function AuthSettingsPage() {
  // Check if the user is authenticated and has admin role
  const session = await auth()

  if (!session?.user) {
    redirect("/api/auth/signin")
  }

  if (session.user.role !== "admin") {
    redirect("/access-denied")
  }

  return <AuthSettingsContent />
}


