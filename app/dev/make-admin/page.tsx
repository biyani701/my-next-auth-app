"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function MakeAdminPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const makeAdmin = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!session?.user?.email) {
        throw new Error("You must be signed in to use this feature")
      }

      // Update the user's role in the database
      const response = await fetch("/api/dev/make-admin")

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to make user admin")
      }

      setResult(data)

      // Update the session to reflect the new role
      // In Auth.js v5, update() doesn't take arguments - it will fetch the latest session data
      await update()

      // Refresh the page after a short delay
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Development Tool Only:</strong> This page is for development purposes only and should not be used in production.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Make User Admin</h1>

        <div className="mb-6">
          <p className="mb-2">Current user: <strong>{session?.user?.email || "Not signed in"}</strong></p>
          <p className="mb-2">Current role: <strong>{session?.user?.role || "None"}</strong></p>
        </div>

        <Button
          onClick={makeAdmin}
          disabled={loading || !session?.user}
          className="w-full"
        >
          {loading ? "Processing..." : "Make Me Admin"}
        </Button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
            <p>{result.message}</p>
            <p className="mt-2">
              <strong>User:</strong> {result.user.email}<br />
              <strong>Role:</strong> {result.user.role}
            </p>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p>After making yourself an admin, you will be able to access the admin dashboard at <a href="/admin" className="text-blue-600 hover:underline">/admin</a>.</p>
          <p className="mt-2">If you are still redirected to the home page, try signing out and signing back in.</p>
        </div>
      </div>
    </div>
  )
}
