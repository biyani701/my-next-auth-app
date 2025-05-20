"use client"

import { Button } from "./ui/button"
import { useState } from "react"

// Provider icons
const ProviderIcons = {
  github: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2">
      <path
        fill="currentColor"
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
      />
    </svg>
  ),
  google: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2">
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2">
      <path
        fill="currentColor"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  ),
  auth0: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2">
      <path
        fill="currentColor"
        d="M21.98 7.448L19.62 0H4.347L2.02 7.448c-1.352 4.312.03 9.206 3.815 12.015L12.007 24l6.157-4.552c3.755-2.81 5.182-7.688 3.815-12.015l-6.16 4.58 2.343 7.45-6.157-4.597-6.158 4.58 2.358-7.433-6.188-4.55 7.63-.045L12.008 0l2.356 7.404 7.615.044z"
      />
    </svg>
  ),
}

// Provider button styles
const ProviderStyles = {
  github: "bg-gray-900 hover:bg-gray-700 text-white",
  google: "bg-white hover:bg-gray-100 text-gray-900 border border-gray-300",
  facebook: "bg-[#1877F2] hover:bg-[#166FE5] text-white",
  auth0: "bg-[#EB5424] hover:bg-[#D44A1A] text-white",
}

export function ProviderButtons() {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  // Auth.js V5 compatible sign-in function
  const handleSignIn = async (provider: string) => {
    setIsLoading(provider)

    // Use the GET method with query parameters to avoid CSRF issues
    // This is more reliable than POST for client-side initiated auth
    window.location.href = `/api/auth/signin/${provider}?callbackUrl=/`
  }

  // List of available providers
  const providers = [
    { id: "github", name: "GitHub" },
    { id: "google", name: "Google" },
    { id: "facebook", name: "Facebook" },
    { id: "auth0", name: "Auth0" },
  ]

  return (
    <div className="flex flex-col gap-3">
      {providers.map((provider) => (
        <Button
          key={provider.id}
          className={`flex items-center justify-center py-6 ${
            ProviderStyles[provider.id as keyof typeof ProviderStyles]
          }`}
          onClick={() => handleSignIn(provider.id)}
          disabled={isLoading !== null}
        >
          {isLoading === provider.id ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent mr-2" />
          ) : (
            ProviderIcons[provider.id as keyof typeof ProviderIcons]
          )}
          Continue with {provider.name}
        </Button>
      ))}
    </div>
  )
}
