"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import SessionRefreshButton from "@/components/session-refresh-button"

export default function AccessDeniedPage() {
  const router = useRouter()
  const { data: session, update, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(10)

  // Redirect after countdown
  useEffect(() => {
    if (countdown <= 0) {
      router.push("/")
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, router])

  // Function to refresh the session
  const refreshSession = async () => {
    setLoading(true)
    try {
      await update() // This will fetch the latest session data from the server
      router.refresh() // Refresh the page to apply the new session data
    } catch (error) {
      console.error("Error refreshing session:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-lg rounded-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter">Access Denied</h1>
          <p className="text-gray-500 dark:text-gray-400">
            You don&apos;t have permission to access this page.
          </p>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-amber-700">
                Your current role is <strong>{session?.user?.role || "none"}</strong>, but this page requires a higher role.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Why am I seeing this?</h2>
            <p className="text-sm text-gray-500">
              This could be because:
            </p>
            <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
              <li>Your role in the database was updated but your session hasn&apos;t been refreshed</li>
              <li>You&apos;re signed in with an account that doesn&apos;t have the required permissions</li>
              <li>You need to be assigned a different role by an administrator</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-medium">What can I do?</h2>
            <div className="flex flex-col space-y-2">
              <SessionRefreshButton
                className="w-full"
                redirectTo="/admin"
              />

              {process.env.NODE_ENV === "development" && (
                <Link href="/dev/make-admin" className="w-full">
                  <Button variant="outline" className="w-full">
                    Make Me Admin (Dev Only)
                  </Button>
                </Link>
              )}

              <Link href="/" className="w-full">
                <Button variant="ghost" className="w-full">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          Redirecting to home in {countdown} seconds...
        </div>
      </Card>
    </div>
  )
}
