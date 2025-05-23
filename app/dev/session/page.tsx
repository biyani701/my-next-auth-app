"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import SessionRefreshButton from "@/components/session-refresh-button"

export default function SessionDebugPage() {
  const router = useRouter()
  const { data: clientSession, status, update } = useSession()
  const [serverSession, setServerSession] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>("user")
  const [updatingRole, setUpdatingRole] = useState(false)

  const fetchServerSession = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/dev/session")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch server session")
      }

      setServerSession(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Fetch server session on mount
  useEffect(() => {
    fetchServerSession()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Client-Side Session</h2>
          <div className="mb-4">
            <p><strong>Status:</strong> {status}</p>
          </div>

          {clientSession ? (
            <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-xs">{JSON.stringify(clientSession, null, 2)}</pre>
            </div>
          ) : (
            <p className="text-gray-500">No client-side session found.</p>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Server-Side Session</h2>
          <div className="mb-4 flex justify-between items-center">
            <p><strong>Status:</strong> {serverSession ? 'Authenticated' : 'Not authenticated'}</p>
            <Button
              onClick={fetchServerSession}
              disabled={loading}
              size="sm"
              variant="outline"
            >
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {serverSession ? (
            <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-xs">{JSON.stringify(serverSession, null, 2)}</pre>
            </div>
          ) : (
            <p className="text-gray-500">No server-side session found.</p>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Debug Tools</h2>

        {clientSession?.user?.email && (
          <div className="mb-6 p-4 border rounded-md">
            <h3 className="font-semibold mb-2">Update User Role</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="role-select">Select Role</Label>
                <Select
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                >
                  <SelectTrigger id="role-select">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Button
                  onClick={async () => {
                    if (!clientSession?.user?.email) return;

                    setUpdatingRole(true);
                    try {
                      const response = await fetch("/api/dev/update-role", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                          email: clientSession.user.email,
                          role: selectedRole
                        })
                      });

                      const data = await response.json();

                      if (!response.ok) {
                        throw new Error(data.error || "Failed to update role");
                      }

                      toast({
                        title: "Role Updated",
                        description: `Role updated to ${selectedRole} in the database`
                      });

                      // Refresh server session data
                      fetchServerSession();

                    } catch (error) {
                      toast({
                        title: "Error",
                        description: error instanceof Error ? error.message : "Failed to update role",
                        variant: "destructive"
                      });
                    } finally {
                      setUpdatingRole(false);
                    }
                  }}
                  disabled={updatingRole || !clientSession?.user?.email}
                >
                  {updatingRole ? "Updating..." : "Update Role in Database"}
                </Button>
              </div>

              <div>
                <SessionRefreshButton />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/dev/make-admin"
            className="block p-4 border rounded-md hover:bg-gray-50 transition"
          >
            <h3 className="font-semibold">Make Admin Tool</h3>
            <p className="text-sm text-gray-600">Make your user an admin to access protected routes</p>
          </a>

          <a
            href="/admin"
            className="block p-4 border rounded-md hover:bg-gray-50 transition"
          >
            <h3 className="font-semibold">Admin Dashboard</h3>
            <p className="text-sm text-gray-600">Access the admin dashboard (requires admin role)</p>
          </a>

          <a
            href="/access-denied"
            className="block p-4 border rounded-md hover:bg-gray-50 transition"
          >
            <h3 className="font-semibold">Access Denied Page</h3>
            <p className="text-sm text-gray-600">View the access denied page</p>
          </a>
        </div>
      </div>
    </div>
  )
}
