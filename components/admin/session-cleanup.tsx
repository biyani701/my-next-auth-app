"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react"

interface CleanupStatus {
  timestamp: string
  expired: {
    sessions: number
    verificationTokens: number
  }
  retentionPeriods: {
    sessionRetentionDays: number
    accountRetentionDays: number
    verificationTokenRetentionDays: number
  }
  cleanupUrl: string
}

interface CleanupResult {
  success: boolean
  timestamp: string
  deleted: {
    expiredSessions: number
    oldSessions: number
    expiredVerificationTokens: number
    oldVerificationTokens: number
  }
  retentionPeriods: {
    sessionRetentionDays: number
    accountRetentionDays: number
    verificationTokenRetentionDays: number
  }
}

export default function SessionCleanup() {
  const [status, setStatus] = useState<CleanupStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [cleaning, setCleaning] = useState(false)
  const [result, setResult] = useState<CleanupResult | null>(null)
  
  // Form state
  const [sessionRetentionDays, setSessionRetentionDays] = useState<number>(30)
  const [verificationTokenRetentionDays, setVerificationTokenRetentionDays] = useState<number>(7)
  
  // Fetch cleanup status
  const fetchStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/cleanup')
      if (!response.ok) {
        throw new Error('Failed to fetch cleanup status')
      }
      const data = await response.json()
      setStatus(data)
      
      // Update form values with current settings
      setSessionRetentionDays(data.retentionPeriods.sessionRetentionDays)
      setVerificationTokenRetentionDays(data.retentionPeriods.verificationTokenRetentionDays)
    } catch (error) {
      console.error('Error fetching cleanup status:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch cleanup status',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Run cleanup
  const runCleanup = async () => {
    setCleaning(true)
    try {
      const response = await fetch('/api/admin/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionRetentionDays,
          verificationTokenRetentionDays,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to run cleanup')
      }
      
      const data = await response.json()
      setResult(data)
      
      toast({
        title: 'Success',
        description: 'Cleanup completed successfully',
      })
      
      // Refresh status after cleanup
      fetchStatus()
    } catch (error) {
      console.error('Error running cleanup:', error)
      toast({
        title: 'Error',
        description: 'Failed to run cleanup',
        variant: 'destructive',
      })
    } finally {
      setCleaning(false)
    }
  }
  
  // Initial fetch
  useEffect(() => {
    fetchStatus()
  }, [])
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Session Cleanup</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchStatus}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Cleanup Status</CardTitle>
            <CardDescription>
              Current status of expired sessions and tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : status ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-3">
                    <div className="text-sm text-muted-foreground">Expired Sessions</div>
                    <div className="text-2xl font-bold">{status.expired.sessions}</div>
                  </div>
                  <div className="border rounded-md p-3">
                    <div className="text-sm text-muted-foreground">Expired Tokens</div>
                    <div className="text-2xl font-bold">{status.expired.verificationTokens}</div>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Current Retention Periods:
                </div>
                <div className="text-sm">
                  <div>Sessions: {status.retentionPeriods.sessionRetentionDays} days</div>
                  <div>Verification Tokens: {status.retentionPeriods.verificationTokenRetentionDays} days</div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Last checked: {new Date(status.timestamp).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 text-muted-foreground">
                <AlertCircle className="h-4 w-4 mr-2" />
                Failed to load status
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Cleanup Card */}
        <Card>
          <CardHeader>
            <CardTitle>Run Cleanup</CardTitle>
            <CardDescription>
              Remove expired sessions and tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionRetention">Session Retention (days)</Label>
                <Input
                  id="sessionRetention"
                  type="number"
                  min="1"
                  max="365"
                  value={sessionRetentionDays}
                  onChange={(e) => setSessionRetentionDays(parseInt(e.target.value) || 30)}
                />
                <p className="text-xs text-muted-foreground">
                  Sessions older than this will be removed
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tokenRetention">Verification Token Retention (days)</Label>
                <Input
                  id="tokenRetention"
                  type="number"
                  min="1"
                  max="30"
                  value={verificationTokenRetentionDays}
                  onChange={(e) => setVerificationTokenRetentionDays(parseInt(e.target.value) || 7)}
                />
                <p className="text-xs text-muted-foreground">
                  Verification tokens older than this will be removed
                </p>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={runCleanup} 
              disabled={cleaning || loading}
              className="w-full"
            >
              {cleaning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Cleaning...
                </>
              ) : (
                'Run Cleanup Now'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
              Cleanup Results
            </CardTitle>
            <CardDescription>
              Completed at {new Date(result.timestamp).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Expired Sessions</div>
                <div className="text-2xl font-bold">{result.deleted.expiredSessions}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Old Sessions</div>
                <div className="text-2xl font-bold">{result.deleted.oldSessions}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Expired Tokens</div>
                <div className="text-2xl font-bold">{result.deleted.expiredVerificationTokens}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Old Tokens</div>
                <div className="text-2xl font-bold">{result.deleted.oldVerificationTokens}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
