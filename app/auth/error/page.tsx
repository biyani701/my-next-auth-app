"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errors = {
    Configuration: {
      title: "Server error",
      message: "There is a problem with the server configuration. Check if your credentials are correct.",
    },
    AccessDenied: {
      title: "Access denied",
      message: "You do not have permission to sign in.",
    },
    Verification: {
      title: "Unable to sign in",
      message: "The sign in link is no longer valid. It may have been used already or it may have expired.",
    },
    OAuthSignin: {
      title: "Unable to sign in",
      message: "Could not start the OAuth sign in process. Please try again.",
    },
    OAuthCallback: {
      title: "Unable to sign in",
      message: "Could not complete the OAuth sign in process. Please try again.",
    },
    OAuthCreateAccount: {
      title: "Unable to sign in",
      message: "Could not create an account using the OAuth provider. Please try another provider.",
    },
    EmailCreateAccount: {
      title: "Unable to sign in",
      message: "Could not create an account using the email provider. Please try another provider.",
    },
    Callback: {
      title: "Unable to sign in",
      message: "Could not complete the sign in process. Please try again.",
    },
    OAuthAccountNotLinked: {
      title: "Account already exists",
      message: "An account already exists with the same email address but different sign-in credentials. Sign in using the original provider to link your accounts.",
    },
    EmailSignin: {
      title: "Unable to sign in",
      message: "Could not send the sign in email. Please try again.",
    },
    CredentialsSignin: {
      title: "Unable to sign in",
      message: "The sign in details you provided were incorrect. Please try again.",
    },
    SessionRequired: {
      title: "Authentication required",
      message: "You must be signed in to access this page.",
    },
    Default: {
      title: "Unable to sign in",
      message: "An unexpected error occurred. Please try again.",
    },
  }

  const errorType = error && error in errors ? error : "Default"
  const { title, message } = errors[errorType as keyof typeof errors]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="logo-container w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Portfolio Logo"
              width={64}
              height={64}
              className="mx-auto w-16 h-16"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-red-600">{title}</h1>
          <p className="text-gray-600 mb-8">
            {message}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <div className="text-center">
            <p className="mb-4">
              Please try signing in with a different provider or go back to the sign-in page.
            </p>
            <div className="flex flex-col gap-4 mt-6">
              <Link
                href="/auth/signin"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Sign In
              </Link>
              <Link
                href="/"
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}
