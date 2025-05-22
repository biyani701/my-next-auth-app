import Image from "next/image"
import { auth } from ".."
import CustomLink from "../components/custom-link"
import { SignIn, SignOut } from "../components/auth-components"
import { getDocsUrl, getAppBaseUrl } from "../lib/docs-url"

// Define provider types
type ProviderID = 'github' | 'google' | 'facebook' | 'auth0' | 'keycloak' | 'credentials';

// Authentication provider icons and colors
const providerIcons: Record<ProviderID, JSX.Element> = {
  github: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 mr-3">
      <path
        fill="#24292E"
        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
      />
    </svg>
  ),
  google: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 mr-3">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 mr-3">
      <path
        fill="#1877F2"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  ),
  auth0: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 mr-3">
      <path
        fill="#EB5424"
        d="M21.98 7.448L19.62 0H4.347L2.02 7.448c-1.352 4.312.03 9.206 3.815 12.015L12.007 24l6.157-4.552c3.755-2.81 5.182-7.688 3.815-12.015l-6.16 4.58 2.343 7.45-6.157-4.597-6.158 4.58 2.358-7.433-6.188-4.55 7.63-.045L12.008 0l2.356 7.404 7.615.044z"
      />
    </svg>
  ),
  keycloak: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 mr-3">
      <path
        fill="#4B5320"
        d="M12 0L1.354 6v12L12 24l10.646-6V6L12 0zm7.925 16.515l-7.925 4.475-7.925-4.475V7.485L12 3.01l7.925 4.475v9.03z"
      />
      <path
        fill="#4B5320"
        d="M12 6.277L7.099 9.144v5.712L12 17.723l4.901-2.867V9.144L12 6.277zm3.921 7.633L12 16.337l-3.921-2.427V9.99L12 7.663l3.921 2.427v4.02z"
      />
    </svg>
  ),
  credentials: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 mr-3">
      <circle cx="12" cy="12" r="10" fill="#805AD5" />
      <rect x="9" y="8" width="6" height="3" rx="1" fill="white" />
      <path
        fill="white"
        d="M16 11H8a1 1 0 00-1 1v4a1 1 0 001 1h8a1 1 0 001-1v-4a1 1 0 00-1-1zm-2 3a1 1 0 11-2 0 1 1 0 012 0zm-3 0a1 1 0 11-2 0 1 1 0 012 0z"
      />
    </svg>
  ),
}

// Auth provider configuration with colors and hover colors
interface Provider {
  id: ProviderID;
  label: string;
  bgColor: string;
  hoverBgColor: string;
  textColor: string;
  borderColor?: string;
  shadowColor?: string;
}

const providers: Provider[] = [
  {
    id: "github",
    label: "Continue with GitHub",
    bgColor: "bg-gray-800",
    hoverBgColor: "hover:bg-gray-900",
    textColor: "text-white",
    shadowColor: "shadow-gray-400/30"
  },
  {
    id: "google",
    label: "Continue with Google",
    bgColor: "bg-white",
    hoverBgColor: "hover:bg-gray-50",
    textColor: "text-gray-700",
    borderColor: "border border-gray-300",
    shadowColor: "shadow-gray-400/30"
  },
  {
    id: "facebook",
    label: "Continue with Facebook",
    bgColor: "bg-blue-600",
    hoverBgColor: "hover:bg-blue-700",
    textColor: "text-white",
    shadowColor: "shadow-blue-600/30"
  },
  {
    id: "auth0",
    label: "Continue with Auth0",
    bgColor: "bg-orange-500",
    hoverBgColor: "hover:bg-orange-600",
    textColor: "text-white",
    shadowColor: "shadow-orange-500/30"
  },
  {
    id: "keycloak",
    label: "Continue with Keycloak",
    bgColor: "bg-green-700",
    hoverBgColor: "hover:bg-green-800",
    textColor: "text-white",
    shadowColor: "shadow-green-700/30"
  },
  {
    id: "credentials",
    label: "Continue with Credentials",
    bgColor: "bg-purple-600",
    hoverBgColor: "hover:bg-purple-700",
    textColor: "text-white",
    shadowColor: "shadow-purple-600/30"
  },
]

export default async function Index() {
  const session = await auth()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 md:p-8">
      {/* Header with Navigation */}
      <header className="w-full max-w-4xl mx-auto mb-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Auth Logo"
              width={32}
              height={32}
              className="rounded-md w-8 h-8"
            />
            <span className="font-semibold text-gray-700">Next Auth Example</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
            <a
              href={getDocsUrl('docs/intro')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Documentation
            </a>
            <a
              href="https://github.com/vishal-biyani/next-auth-example"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 mr-1">
                <path
                  fill="currentColor"
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
              GitHub
            </a>
          </div>
        </nav>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white p-2 shadow-lg ring-2 ring-blue-100 flex items-center justify-center logo-container">
            <Image
              src="/logo.png"
              alt="Portfolio Logo"
              width={64}
              height={64}
              className="object-contain p-2 w-16 h-16"
            />
          </div>
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Secure Authentication
          </h1>
          <p className="text-gray-600 text-lg">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Auth Container */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {session ? (
            // Logged in state
            <div className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Welcome back!</h2>
              <p className="text-center mb-6 text-gray-600">
                You are signed in as <span className="font-semibold text-blue-600">{session.user?.name || session.user?.email}</span>
              </p>

              <div className="space-y-4 mb-8">
                <CustomLink
                  href="/(examples)/server-example"
                  className="flex items-center justify-center py-3 px-4 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  View Server Example
                </CustomLink>

                <CustomLink
                  href="/(examples)/client-example"
                  className="flex items-center justify-center py-3 px-4 w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  View Client Example
                </CustomLink>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <SignOut className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors duration-200">
                  Sign Out
                </SignOut>
              </div>
            </div>
          ) : (
            // Login options
            <div className="p-8">
              <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Welcome</h2>
              <p className="text-center mb-8 text-gray-600">Choose your preferred sign-in method</p>

              <div className="space-y-4">
                {providers.map((provider) => (
                  <SignIn
                    key={provider.id}
                    provider={provider.id}
                    className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all duration-200
                      ${provider.bgColor} ${provider.hoverBgColor} ${provider.textColor} ${provider.borderColor || ''}
                      shadow-md hover:shadow-lg ${provider.shadowColor || ''} transform hover:-translate-y-0.5`}
                  >
                    <div className="flex items-center justify-center">
                      {providerIcons[provider.id]}
                      <span>{provider.label}</span>
                    </div>
                  </SignIn>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                <p>By signing in, you agree to our {' '}
                  <a
                    href={getDocsUrl('docs/terms-of-service')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Terms of Service
                  </a> {' '}
                  and {' '}
                  <a
                    href={getDocsUrl('docs/privacy-policy')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Session Debug Panel */}
        {session && (
          <div className="mt-8 rounded-xl overflow-hidden bg-white shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Current Session
            </div>
            <pre className="whitespace-pre-wrap break-all p-4 text-xs overflow-auto max-h-64 bg-gray-50">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto mt-16 pb-8">
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Image
                src="/logo.png"
                alt="Auth Logo"
                width={24}
                height={24}
                className="rounded-md mr-2 w-6 h-6"
              />
              <span className="text-sm text-gray-500">© {new Date().getFullYear()} Next Auth Example</span>
            </div>

            <div className="flex space-x-6 text-sm">
              <a
                href={getDocsUrl('docs/terms-of-service')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Terms
              </a>
              <a
                href={getDocsUrl('docs/privacy-policy')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Privacy
              </a>
              <a
                href={getDocsUrl('docs/intro')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Docs
              </a>
              <a
                href="https://github.com/vishal-biyani/next-auth-example"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}