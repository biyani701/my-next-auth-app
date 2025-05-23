"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface SessionRefreshButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  redirectTo?: string
}

export default function SessionRefreshButton({
  variant = "default",
  size = "default",
  className = "",
  redirectTo
}: SessionRefreshButtonProps) {
  const { data: session, update, status } = useSession({ required: false })
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const refreshSession = async () => {
    if (!session?.user?.email) {
      toast({
        title: "Not signed in",
        description: "You must be signed in to refresh your session",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      // First, check if the session needs to be refreshed
      const response = await fetch("/api/auth/refresh")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to check session")
      }

      if (data.roleChanged) {
        // Update the session with the latest user data
        await update({
          ...session,
          user: {
            ...session.user,
            role: data.databaseUser.role
          }
        })

        toast({
          title: "Session updated",
          description: `Your role has been updated to ${data.databaseUser.role}`,
        })

        // Refresh the page or redirect
        if (redirectTo) {
          router.push(redirectTo)
        } else {
          router.refresh()
        }
      } else {
        toast({
          title: "Session already up to date",
          description: "Your session already has the latest role information",
        })
      }
    } catch (error) {
      console.error("Error refreshing session:", error)
      toast({
        title: "Error",
        description: "Failed to refresh session. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={refreshSession}
      disabled={loading || !session}
    >
      {loading ? "Refreshing..." : "Refresh Session"}
    </Button>
  )
}
