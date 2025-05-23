"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export default function AuthSettingsContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [sessionStrategy, setSessionStrategy] = useState<string>("jwt")
  const [sessionMaxAge, setSessionMaxAge] = useState<number>(30 * 24 * 60 * 60) // 30 days in seconds
  const [sessionRetentionDays, setSessionRetentionDays] = useState<number>(30)
  const [verificationTokenRetentionDays, setVerificationTokenRetentionDays] = useState<number>(7)
  const [enableRateLimiting, setEnableRateLimiting] = useState<boolean>(true)
  
  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch these from an API
        // For now, we'll just simulate it with a timeout
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Set default values (in a real app, these would come from the API)
        setSessionStrategy(localStorage.getItem("sessionStrategy") || "jwt")
        setSessionMaxAge(parseInt(localStorage.getItem("sessionMaxAge") || String(30 * 24 * 60 * 60)))
        setSessionRetentionDays(parseInt(localStorage.getItem("sessionRetentionDays") || "30"))
        setVerificationTokenRetentionDays(parseInt(localStorage.getItem("verificationTokenRetentionDays") || "7"))
        setEnableRateLimiting(localStorage.getItem("enableRateLimiting") !== "false")
      } catch (error) {
        console.error("Error fetching settings:", error)
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchSettings()
  }, [])
  
  // Save settings
  const saveSettings = async () => {
    setSaving(true)
    try {
      // In a real app, you would save these to an API
      // For now, we'll just save to localStorage for demo purposes
      localStorage.setItem("sessionStrategy", sessionStrategy)
      localStorage.setItem("sessionMaxAge", String(sessionMaxAge))
      localStorage.setItem("sessionRetentionDays", String(sessionRetentionDays))
      localStorage.setItem("verificationTokenRetentionDays", String(verificationTokenRetentionDays))
      localStorage.setItem("enableRateLimiting", String(enableRateLimiting))
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Settings Saved",
        description: "Auth settings have been updated successfully",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Auth Settings</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Configuration</CardTitle>
              <CardDescription>
                Configure how user sessions are handled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-strategy">Session Strategy</Label>
                <Select
                  value={sessionStrategy}
                  onValueChange={setSessionStrategy}
                >
                  <SelectTrigger id="session-strategy">
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jwt">JWT (Stateless)</SelectItem>
                    <SelectItem value="database">Database (Stateful)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  JWT is faster but less secure. Database allows for immediate session revocation.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="session-max-age">Session Max Age (days)</Label>
                <Input
                  id="session-max-age"
                  type="number"
                  min="1"
                  max="365"
                  value={Math.round(sessionMaxAge / (24 * 60 * 60))}
                  onChange={(e) => setSessionMaxAge(parseInt(e.target.value) * 24 * 60 * 60)}
                />
                <p className="text-sm text-muted-foreground">
                  How long a session remains valid before requiring re-authentication
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
              <CardDescription>
                Configure how long data is kept in the database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-retention">Session Retention (days)</Label>
                <Input
                  id="session-retention"
                  type="number"
                  min="1"
                  max="365"
                  value={sessionRetentionDays}
                  onChange={(e) => setSessionRetentionDays(parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">
                  How long expired sessions are kept in the database
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="token-retention">Verification Token Retention (days)</Label>
                <Input
                  id="token-retention"
                  type="number"
                  min="1"
                  max="30"
                  value={verificationTokenRetentionDays}
                  onChange={(e) => setVerificationTokenRetentionDays(parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">
                  How long expired verification tokens are kept in the database
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security features for authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="rate-limiting">Rate Limiting</Label>
                  <p className="text-sm text-muted-foreground">
                    Limit the number of authentication attempts
                  </p>
                </div>
                <Switch
                  id="rate-limiting"
                  checked={enableRateLimiting}
                  onCheckedChange={setEnableRateLimiting}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Apply Changes</CardTitle>
              <CardDescription>
                Save your configuration changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Some changes may require a server restart to take effect.
                Environment variables will need to be updated manually.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={saveSettings} 
                disabled={saving}
                className="w-full"
              >
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
