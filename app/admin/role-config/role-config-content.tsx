"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Trash2, Plus, Save } from "lucide-react"

// Define role type
interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
}

export default function RoleConfigContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [roles, setRoles] = useState<Role[]>([])
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDescription, setNewRoleDescription] = useState("")
  
  // Fetch current roles
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch these from an API
        // For now, we'll just simulate it with a timeout
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Get roles from localStorage or use defaults
        const savedRoles = localStorage.getItem("customRoles")
        if (savedRoles) {
          setRoles(JSON.parse(savedRoles))
        } else {
          // Default roles
          setRoles([
            {
              id: "user",
              name: "User",
              description: "Basic authenticated user with limited access",
              permissions: ["read:own_profile", "update:own_profile"]
            },
            {
              id: "moderator",
              name: "Moderator",
              description: "Can moderate content and manage basic resources",
              permissions: ["read:own_profile", "update:own_profile", "read:users", "moderate:content"]
            },
            {
              id: "admin",
              name: "Administrator",
              description: "Full access to all system features",
              permissions: ["read:own_profile", "update:own_profile", "read:users", "moderate:content", "manage:users", "manage:system"]
            }
          ])
        }
      } catch (error) {
        console.error("Error fetching roles:", error)
        toast({
          title: "Error",
          description: "Failed to load roles",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchRoles()
  }, [])
  
  // Save roles
  const saveRoles = async () => {
    setSaving(true)
    try {
      // In a real app, you would save these to an API
      // For now, we'll just save to localStorage for demo purposes
      localStorage.setItem("customRoles", JSON.stringify(roles))
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Roles Saved",
        description: "Role configuration has been updated successfully",
      })
    } catch (error) {
      console.error("Error saving roles:", error)
      toast({
        title: "Error",
        description: "Failed to save roles",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }
  
  // Add a new role
  const addRole = () => {
    if (!newRoleName.trim()) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive"
      })
      return
    }
    
    // Create a new role ID (lowercase, no spaces)
    const newRoleId = newRoleName.toLowerCase().replace(/\s+/g, '_')
    
    // Check if role ID already exists
    if (roles.some(role => role.id === newRoleId)) {
      toast({
        title: "Error",
        description: "A role with this name already exists",
        variant: "destructive"
      })
      return
    }
    
    // Add the new role
    setRoles([
      ...roles,
      {
        id: newRoleId,
        name: newRoleName,
        description: newRoleDescription || `Custom role: ${newRoleName}`,
        permissions: ["read:own_profile", "update:own_profile"] // Default permissions
      }
    ])
    
    // Clear the form
    setNewRoleName("")
    setNewRoleDescription("")
    
    toast({
      title: "Role Added",
      description: `New role "${newRoleName}" has been added`,
    })
  }
  
  // Remove a role
  const removeRole = (roleId: string) => {
    // Don't allow removing built-in roles
    if (["user", "moderator", "admin"].includes(roleId)) {
      toast({
        title: "Cannot Remove",
        description: "Built-in roles cannot be removed",
        variant: "destructive"
      })
      return
    }
    
    setRoles(roles.filter(role => role.id !== roleId))
    
    toast({
      title: "Role Removed",
      description: "The role has been removed",
    })
  }
  
  // Update role description
  const updateRoleDescription = (roleId: string, description: string) => {
    setRoles(roles.map(role => 
      role.id === roleId ? { ...role, description } : role
    ))
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Role Configuration</h1>
        <Button 
          variant="outline" 
          onClick={() => router.push("/admin")}
        >
          Back to Dashboard
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Roles</CardTitle>
              <CardDescription>
                Configure roles and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead className="w-[400px]">Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>
                        <Input
                          value={role.description}
                          onChange={(e) => updateRoleDescription(role.id, e.target.value)}
                          disabled={["user", "moderator", "admin"].includes(role.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          {role.permissions.map((permission) => (
                            <div key={permission} className="bg-muted px-2 py-1 rounded inline-block mr-1">
                              {permission}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRole(role.id)}
                          disabled={["user", "moderator", "admin"].includes(role.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={saveRoles} 
                disabled={saving}
                className="ml-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Add New Role</CardTitle>
              <CardDescription>
                Create a custom role with specific permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-role-name">Role Name</Label>
                  <Input
                    id="new-role-name"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="e.g. Content Editor"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-role-description">Description</Label>
                  <Input
                    id="new-role-description"
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                    placeholder="e.g. Can edit content but not publish"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={addRole}
                disabled={!newRoleName.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Role
              </Button>
            </CardFooter>
          </Card>
          
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Note about Role Configuration</h3>
            <p className="text-sm text-muted-foreground">
              Changes to role configuration are stored locally for demonstration purposes.
              In a production environment, these would be saved to your database and would require
              additional code changes to implement custom roles beyond the built-in ones.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
