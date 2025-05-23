"use client"

import { useState, useEffect } from "react"
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
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [sessionData, setSessionData] = useState<{
    data: any | null;
    status: "loading" | "authenticated" | "unauthenticated";
    update: () => Promise<any>;
  }>({
    data: null,
    status: "loading",
    update: async () => null
  })

  // Initialize session data after mount
  useEffect(() => {
    try {
      setMounted(true)
      // Import useSession dynamically to ensure it only runs on client
      import("next-auth/react").then(({ useSession }) => {
        try {
          const { data, status, update } = useSession({ required: false })
          setSessionData({ data, status, update })
        } catch (error) {
          console.error("Error initializing session:", error)
        }
      }).catch(error => {
        console.error("Error importing useSession:", error)
      })
    } catch (error) {
      console.error("Error in useEffect:", error)
    }
  }, [])

  const refreshSession = async () => {
    if (!mounted) return

    if (!sessionData.data?.user?.email) {
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
        // Update the session without arguments - Auth.js v5 will fetch the latest session data
        await sessionData.update()

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

  // If not mounted yet, return a disabled button
  if (!mounted) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled={true}
      >
        Loading...
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={refreshSession}
      disabled={loading || !sessionData.data}
    >
      {loading ? "Refreshing..." : "Refresh Session"}
    </Button>
  )
}
