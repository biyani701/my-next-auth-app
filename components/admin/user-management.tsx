"use client"

import { useState, useEffect } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Role } from "@/lib/auth-utils"

// Define user type
interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string
  emailVerified: string | null
  _count: {
    accounts: number
    sessions: number
  }
}

// Define pagination type
interface Pagination {
  total: number
  pages: number
  page: number
  limit: number
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [updating, setUpdating] = useState<string | null>(null)

  // Fetch users
  const fetchUsers = async (page = 1) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users?page=${page}&limit=${pagination.limit}`)
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const data = await response.json()
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Update user role
  const updateUserRole = async (userId: string, role: Role) => {
    setUpdating(userId)
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, role })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update user role")
      }
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role } : user
      ))
      
      toast({
        title: "Success",
        description: "User role updated successfully",
      })
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user role",
        variant: "destructive"
      })
    } finally {
      setUpdating(null)
    }
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchUsers(page)
  }

  // Filter users by search term
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Initial fetch
  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => fetchUsers()} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Accounts</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.image || ""} alt={user.name || ""} />
                          <AvatarFallback>
                            {user.name?.substring(0, 2).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span>{user.name || "Anonymous"}</span>
                      </TableCell>
                      <TableCell>{user.email || "No email"}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value: Role) => updateUserRole(user.id, value)}
                          disabled={updating === user.id}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{user._count.accounts}</TableCell>
                      <TableCell>{user._count.sessions}</TableCell>
                      <TableCell>
                        {updating === user.id ? (
                          <span className="text-sm text-muted-foreground">Updating...</span>
                        ) : (
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {pagination.pages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                    className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === pagination.pages || 
                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                  )
                  .map((page, i, array) => (
                    <PaginationItem key={page}>
                      {i > 0 && array[i - 1] !== page - 1 && (
                        <PaginationItem>
                          <span className="px-4">...</span>
                        </PaginationItem>
                      )}
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === pagination.page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))
                }
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                    className={pagination.page >= pagination.pages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}
