import { auth } from "auth"
import { SignIn } from "@/components/auth-components"
import { ProviderButtons } from "@/components/provider-buttons"
import Link from "next/link"
import Image from "next/image"

export default async function SignInPage() {
  const session = await auth()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="bg-blue-600 dark:bg-blue-800 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Image
              src="/logo.png"
              alt="Portfolio Logo"
              width={60}
              height={60}
              className="mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Authentication</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Sign in to access your portfolio dashboard
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {session ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center mb-6">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user?.name || "User"}
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-blue-500"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                    {session.user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">Welcome back!</h2>
              <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
                You are signed in as <strong className="text-blue-600 dark:text-blue-400">{session.user?.name}</strong>
              </p>
              <div className="flex justify-center">
                <SignIn>
                  <div className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Go to Dashboard
                  </div>
                </SignIn>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Choose a sign-in method</h2>
              <div className="grid gap-4">
                <SignIn provider="github">
                  <div className="flex items-center justify-center py-3 px-4 bg-gray-800 hover:bg-black text-white rounded-lg transition-all duration-200 transform hover:scale-105">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-3">
                      <path
                        fill="currentColor"
                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                      />
                    </svg>
                    Continue with GitHub
                  </div>
                </SignIn>

                <SignIn provider="google">
                  <div className="flex items-center justify-center py-3 px-4 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-lg transition-all duration-200 transform hover:scale-105">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-3">
                      <path
                        fill="#4285F4"
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      />
                    </svg>
                    Continue with Google
                  </div>
                </SignIn>

                <SignIn provider="facebook">
                  <div className="flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-3">
                      <path
                        fill="currentColor"
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      />
                    </svg>
                    Continue with Facebook
                  </div>
                </SignIn>

                <SignIn provider="auth0">
                  <div className="flex items-center justify-center py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-3">
                      <path
                        fill="currentColor"
                        d="M21.98 7.448L19.62 0H4.347L2.02 7.448c-1.352 4.312.03 9.206 3.815 12.015L12.007 24l6.157-4.552c3.755-2.81 5.182-7.688 3.815-12.015l-6.16 4.58 2.343 7.45-6.157-4.597-6.158 4.58 2.358-7.433-6.188-4.55 7.63-.045L12.008 0l2.356 7.404 7.615.044z"
                      />
                    </svg>
                    Continue with Auth0
                  </div>
                </SignIn>

                <SignIn provider="keycloak">
                  <div className="flex items-center justify-center py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-all duration-200 transform hover:scale-105">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-3">
                      <path
                        fill="currentColor"
                        d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4c5.302 0 9.6 4.298 9.6 9.6s-4.298 9.6-9.6 9.6-9.6-4.298-9.6-9.6S6.698 2.4 12 2.4zm-4.8 4.8v9.6h2.4v-3.6h2.4l2.4 3.6h2.4l-2.4-3.6c1.325 0 2.4-1.075 2.4-2.4V9.6c0-1.325-1.075-2.4-2.4-2.4H7.2zm2.4 2.4h4.8v2.4H9.6V9.6z"
                      />
                    </svg>
                    Continue with Keycloak
                  </div>
                </SignIn>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-center">
                  <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
