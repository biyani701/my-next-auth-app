"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Play, Save, Trash, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// Define endpoint preset type
interface EndpointPreset {
  id: string
  name: string
  url: string
  method: string
  headers: { key: string; value: string }[]
  body: string
  description: string
}

// HTTP methods
const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"]

// Default presets
const DEFAULT_PRESETS: EndpointPreset[] = [
  {
    id: "track-post",
    name: "Track Event (POST)",
    url: "/api/proxy/track",
    method: "POST",
    headers: [
      { key: "Content-Type", value: "application/json" }
    ],
    body: JSON.stringify({
      event: "button_click",
      properties: {
        buttonId: "signup",
        page: "/landing"
      },
      userId: "test-user-123"
    }, null, 2),
    description: "Track a user event with the click tracker API (via proxy)"
  },
  {
    id: "track-get",
    name: "Track Event (GET)",
    url: "/api/proxy/track",
    method: "GET",
    headers: [],
    body: "",
    description: "Get tracking data from the click tracker API (via proxy)"
  },
  {
    id: "track-direct-post",
    name: "Track Event Direct (POST)",
    url: "https://click-tracker-five.vercel.app/api/track",
    method: "POST",
    headers: [
      { key: "Content-Type", value: "application/json" }
    ],
    body: JSON.stringify({
      event: "button_click",
      properties: {
        buttonId: "signup",
        page: "/landing"
      },
      userId: "test-user-123"
    }, null, 2),
    description: "Track a user event directly (may have CORS issues)"
  },
  {
    id: "session",
    name: "Get Session",
    url: "/api/auth/session",
    method: "GET",
    headers: [],
    body: "",
    description: "Get the current user session"
  },
  {
    id: "protected",
    name: "Protected API",
    url: "/api/protected",
    method: "GET",
    headers: [],
    body: "",
    description: "Access a protected API endpoint"
  }
]

export default function ApiTesterContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  // Request state
  const [url, setUrl] = useState("/api/proxy/track")
  const [method, setMethod] = useState("POST")
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
    { key: "Content-Type", value: "application/json" }
  ])
  const [body, setBody] = useState("")
  const [response, setResponse] = useState<any>(null)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [responseStatus, setResponseStatus] = useState<number | null>(null)
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({})
  const [presets, setPresets] = useState<EndpointPreset[]>([])
  const [showHeadersPanel, setShowHeadersPanel] = useState(true)

  // Load presets from localStorage (safely for SSR)
  useEffect(() => {
    // Set initial body for POST
    if (method === "POST") {
      setBody(JSON.stringify({
        event: "button_click",
        properties: {
          buttonId: "signup",
          page: "/landing"
        },
        userId: "test-user-123"
      }, null, 2))
    }

    // Safe localStorage access (only in browser)
    if (typeof window !== 'undefined') {
      try {
        const savedPresets = localStorage.getItem("api-tester-presets")
        if (savedPresets) {
          setPresets(JSON.parse(savedPresets))
        } else {
          setPresets(DEFAULT_PRESETS)
          localStorage.setItem("api-tester-presets", JSON.stringify(DEFAULT_PRESETS))
        }
      } catch (error) {
        console.error("Error loading presets:", error)
        setPresets(DEFAULT_PRESETS)
      }
    } else {
      // Server-side rendering, use default presets
      setPresets(DEFAULT_PRESETS)
    }
  }, [])

  // Add a new header
  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }])
  }

  // Update a header
  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    const newHeaders = [...headers]
    newHeaders[index][field] = value
    setHeaders(newHeaders)
  }

  // Remove a header
  const removeHeader = (index: number) => {
    const newHeaders = [...headers]
    newHeaders.splice(index, 1)
    setHeaders(newHeaders)
  }

  // Load a preset
  const loadPreset = (preset: EndpointPreset) => {
    setUrl(preset.url)
    setMethod(preset.method)
    setHeaders(preset.headers)
    setBody(preset.body)
  }

  // Save current configuration as a preset
  const saveAsPreset = () => {
    // Safe browser-only operations
    if (typeof window !== 'undefined') {
      const name = window.prompt("Enter a name for this preset:")
      if (!name) return

      const description = window.prompt("Enter a description (optional):") || ""

      const newPreset: EndpointPreset = {
        id: Date.now().toString(),
        name,
        url,
        method,
        headers,
        body,
        description
      }

      const updatedPresets = [...presets, newPreset]
      setPresets(updatedPresets)

      // Save to localStorage
      try {
        localStorage.setItem("api-tester-presets", JSON.stringify(updatedPresets))
      } catch (error) {
        console.error("Error saving presets:", error)
      }

      toast({
        title: "Preset Saved",
        description: `Saved "${name}" to your presets`
      })
    }
  }

  // Delete a preset
  const deletePreset = (id: string) => {
    // Safe browser-only operations
    if (typeof window !== 'undefined') {
      if (!window.confirm("Are you sure you want to delete this preset?")) return

      const updatedPresets = presets.filter(preset => preset.id !== id)
      setPresets(updatedPresets)

      // Save to localStorage
      try {
        localStorage.setItem("api-tester-presets", JSON.stringify(updatedPresets))
      } catch (error) {
        console.error("Error saving presets:", error)
      }

      toast({
        title: "Preset Deleted",
        description: "The preset has been removed"
      })
    }
  }

  // Format JSON in the body textarea
  const formatJson = () => {
    try {
      const parsed = JSON.parse(body)
      setBody(JSON.stringify(parsed, null, 2))
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "The body content is not valid JSON",
        variant: "destructive"
      })
    }
  }

  // Copy response to clipboard
  const copyResponse = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2))
      toast({
        title: "Copied",
        description: "Response copied to clipboard"
      })
    }
  }

  // Send the request
  const sendRequest = async () => {
    setSending(true)
    setResponse(null)
    setResponseTime(null)
    setResponseStatus(null)
    setResponseHeaders({})

    try {
      const startTime = performance.now()

      // Prepare headers
      const requestHeaders: Record<string, string> = {}
      headers.forEach(header => {
        if (header.key && header.value) {
          requestHeaders[header.key] = header.value
        }
      })

      // Prepare request options
      const options: RequestInit = {
        method,
        headers: requestHeaders,
      }

      // Add body for non-GET/HEAD requests
      if (method !== "GET" && method !== "HEAD" && body) {
        options.body = body
      }

      // Send the request
      const response = await fetch(url, options)
      const endTime = performance.now()

      // Process response headers
      const responseHeadersObj: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        responseHeadersObj[key] = value
      })

      // Set response data
      setResponseTime(Math.round(endTime - startTime))
      setResponseStatus(response.status)
      setResponseHeaders(responseHeadersObj)

      // Try to parse as JSON, fallback to text
      try {
        const data = await response.json()
        setResponse(data)
      } catch (error) {
        const text = await response.text()
        setResponse(text || "(Empty response)")
      }
    } catch (error) {
      console.error("Request error:", error)
      setResponse({
        error: "Request failed",
        message: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setSending(false)
    }
  }

  // Get status color based on HTTP status code
  const getStatusColor = (status: number | null) => {
    if (!status) return "bg-gray-200 text-gray-800"
    if (status >= 200 && status < 300) return "bg-green-100 text-green-800"
    if (status >= 300 && status < 400) return "bg-blue-100 text-blue-800"
    if (status >= 400 && status < 500) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">API Tester</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/admin")}
        >
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Presets sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Presets</CardTitle>
              <CardDescription>Saved API configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {presets.map(preset => (
                <div key={preset.id} className="flex flex-col space-y-1 border-b pb-2 last:border-0">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="ghost"
                      className="justify-start p-2 h-auto font-medium"
                      onClick={() => loadPreset(preset)}
                    >
                      {preset.name}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePreset(preset.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 px-2">
                    <Badge variant="outline" className="text-xs">
                      {preset.method}
                    </Badge>
                    <span className="text-xs text-muted-foreground truncate">
                      {preset.url}
                    </span>
                  </div>
                  {preset.description && (
                    <p className="text-xs text-muted-foreground px-2">
                      {preset.description}
                    </p>
                  )}
                </div>
              ))}

              {presets.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No saved presets
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={saveAsPreset}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Current as Preset
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Request panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Request</CardTitle>
              <CardDescription>Configure your API request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* URL and method */}
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <div className="flex gap-2">
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      {HTTP_METHODS.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://api.example.com/endpoint"
                  />
                </div>
              </div>

              {/* Headers */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Headers</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHeadersPanel(!showHeadersPanel)}
                  >
                    {showHeadersPanel ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>

                {showHeadersPanel && (
                  <div className="space-y-2 border rounded-md p-3">
                    {headers.map((header, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          placeholder="Header name"
                          value={header.key}
                          onChange={(e) => updateHeader(index, "key", e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Value"
                          value={header.value}
                          onChange={(e) => updateHeader(index, "value", e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeHeader(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addHeader}
                      className="w-full mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Header
                    </Button>
                  </div>
                )}
              </div>

              {/* Request body */}
              {method !== "GET" && method !== "HEAD" && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="body">Request Body</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={formatJson}
                    >
                      Format JSON
                    </Button>
                  </div>
                  <Textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Enter request body (JSON, form data, etc.)"
                    className="font-mono text-sm min-h-[200px]"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={sendRequest}
                disabled={sending}
              >
                {sending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Send Request
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Response panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Response</CardTitle>
              <CardDescription>API response details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Response status */}
              {responseStatus !== null && (
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(responseStatus)}`}>
                    {responseStatus}
                  </div>
                  {responseTime !== null && (
                    <div className="text-sm text-muted-foreground">
                      {responseTime}ms
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={copyResponse}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              )}

              {/* Response headers */}
              {Object.keys(responseHeaders).length > 0 && (
                <div className="space-y-2">
                  <Label>Response Headers</Label>
                  <div className="border rounded-md p-3 bg-muted/50">
                    <ScrollArea className="h-[100px]">
                      {Object.entries(responseHeaders).map(([key, value]) => (
                        <div key={key} className="flex py-1 text-sm">
                          <span className="font-medium mr-2">{key}:</span>
                          <span className="text-muted-foreground">{value}</span>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>
              )}

              {/* Response body */}
              <div className="space-y-2">
                <Label>Response Body</Label>
                <div className="border rounded-md p-3 bg-muted/50">
                  {response ? (
                    <ScrollArea className="h-[400px]">
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        {typeof response === 'string'
                          ? response
                          : JSON.stringify(response, null, 2)
                        }
                      </pre>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      {sending
                        ? "Waiting for response..."
                        : "Send a request to see the response"
                      }
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">About the API Tester</h3>
        <p className="text-sm text-muted-foreground">
          This tool allows you to test API endpoints, including the click tracking API. To avoid CORS issues,
          use the proxy endpoint at <code className="mx-1 px-1 py-0.5 bg-muted-foreground/20 rounded">/api/proxy/track</code> instead
          of directly calling <code className="mx-1 px-1 py-0.5 bg-muted-foreground/20 rounded">https://click-tracker-five.vercel.app/api/track</code>.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          For the track endpoint, use POST requests with JSON payloads to record events, and GET requests to retrieve tracking data.
          The proxy will forward your requests to the actual API and return the responses.
        </p>
        <p className="text-sm text-muted-foreground mt-2 text-yellow-600">
          <strong>Note:</strong> Direct requests to the external API may fail due to CORS restrictions. Always use the proxy endpoint.
        </p>
      </div>
    </div>
  )
}