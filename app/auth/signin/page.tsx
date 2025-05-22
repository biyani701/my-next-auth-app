import { auth } from "../../.."
import { SignIn } from "../../../components/auth-components"
import { ProviderButtons } from "../../../components/provider-buttons"
import Link from "next/link"
import Image from "next/image"

export default async function SignInPage() {
  const session = await auth()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="bg-blue-600 dark:bg-blue-800 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg logo-container">
            <Image
              src="/logo.png"
              alt="Portfolio Logo"
              width={48}
              height={48}
              className="mx-auto w-12 h-12"
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
              <ProviderButtons />

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
