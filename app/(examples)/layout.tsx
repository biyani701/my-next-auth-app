import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { getDocsUrl } from "../../lib/docs-url"

export default function ExamplesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Custom header for example pages */}
      <header className="border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Auth Logo"
              width={32}
              height={32}
              className="rounded-md w-8 h-8"
            />
            <span className="font-semibold">Next Auth Example</span>
          </Link>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Custom footer for example pages */}
      <footer className="border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Next Auth Example. All rights reserved.</p>
          <div className="mt-2">
            <Link href="/" className="text-blue-600 hover:text-blue-800 mx-2">
              Home
            </Link>
            <a
              href={getDocsUrl('docs/privacy-policy')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 mx-2"
            >
              Privacy Policy
            </a>
            <a
              href={getDocsUrl('docs/terms-of-service')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 mx-2"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
