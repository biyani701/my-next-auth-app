import NextAuth from "next-auth"
import "next-auth/jwt"

// import Apple from "next-auth/providers/apple"
// import Atlassian from "next-auth/providers/atlassian"
import Auth0 from "next-auth/providers/auth0"
// import AzureB2C from "next-auth/providers/azure-ad-b2c"
// import BankIDNorway from "next-auth/providers/bankid-no"
import Credentials from "next-auth/providers/credentials"
// import BoxyHQSAML from "next-auth/providers/boxyhq-saml"
// import Cognito from "next-auth/providers/cognito"
// import Coinbase from "next-auth/providers/coinbase"
// import Discord from "next-auth/providers/discord"
// import Dropbox from "next-auth/providers/dropbox"
import Facebook from "next-auth/providers/facebook"
import GitHub from "next-auth/providers/github"
// import GitLab from "next-auth/providers/gitlab"
import Google from "next-auth/providers/google"
// import Hubspot from "next-auth/providers/hubspot"
import Keycloak from "next-auth/providers/keycloak"
// import LinkedIn from "next-auth/providers/linkedin"
// import MicrosoftEntraId from "next-auth/providers/microsoft-entra-id"
// import Netlify from "next-auth/providers/netlify"
// import Okta from "next-auth/providers/okta"
// import Passage from "next-auth/providers/passage"
// import Passkey from "next-auth/providers/passkey"
// import Pinterest from "next-auth/providers/pinterest"
// import Reddit from "next-auth/providers/reddit"
// import Slack from "next-auth/providers/slack"
// import Salesforce from "next-auth/providers/salesforce"
// import Spotify from "next-auth/providers/spotify"
// import Twitch from "next-auth/providers/twitch"
// import Twitter from "next-auth/providers/twitter"
// import Vipps from "next-auth/providers/vipps"
// import WorkOS from "next-auth/providers/workos"
// import Zoom from "next-auth/providers/zoom"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"

// Import these for fallback if DATABASE_URL is not set
import { createStorage } from "unstorage"
import memoryDriver from "unstorage/drivers/memory"
import vercelKVDriver from "unstorage/drivers/vercel-kv"
import { UnstorageAdapter } from "@auth/unstorage-adapter"

// Configure storage for Auth.js (fallback if DATABASE_URL is not set)
const storage = createStorage({
  driver: (() => {
    // Check if we're on Vercel and have the required KV configuration
    if (process.env.VERCEL && process.env.AUTH_KV_REST_API_URL && process.env.AUTH_KV_REST_API_TOKEN) {
      console.log('[auth] Using Vercel KV storage');
      return vercelKVDriver({
        url: process.env.AUTH_KV_REST_API_URL,
        token: process.env.AUTH_KV_REST_API_TOKEN,
        env: false,
      });
    } else {
      // Fall back to memory driver if not on Vercel or missing KV config
      console.log('[auth] Using memory storage (no database configuration found)');
      return memoryDriver();
    }
  })(),
})

// We'll use the standard adapter but handle account linking in the callbacks

// Define a type for request-like objects
type RequestLike = { headers: Record<string, string | string[] | undefined> }

// More robust function to determine the base URL based on environment and request context
export function getBaseUrl(req?: RequestLike): string {
  // 1. Use explicitly configured AUTH_URL first (recommended in production)
  if (process.env.AUTH_URL) {
    return process.env.AUTH_URL;
  }

  // 2. If inside a request (server-side), infer from headers
  if (req) {
    const proto = (req.headers['x-forwarded-proto'] || 'https') as string;
    const host = req.headers.host as string;
    return `${proto}://${host}`;
  }

  // 3. Local dev fallback
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // 4. Use Vercel's deployment URL (available at build time)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 5. Last resort fallback to production URL
  return 'https://my-next-auth-app-ten.vercel.app';
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  theme: {
    logo: "/logo.png",
    brandColor: "#0070f3",
    buttonText: "#ffffff",
  },
  // Use UnstorageAdapter for now until database connectivity issues are resolved
  adapter: UnstorageAdapter(storage),
  trustHost: true,
  // Set the URL for callbacks
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  // We'll use the standard providers list
  providers: [
    Auth0({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: `https://${process.env.AUTH0_ISSUER}`,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER,
      name: "Keycloak"
    }),
    // Add test credentials provider for testing
    Credentials({
      id: "test-credentials",
      name: "Test Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is a test provider, so we'll accept any credentials
        if (credentials?.email && credentials?.password) {
          return {
            id: "1",
            name: "Test User",
            email: credentials.email as string,
          };
        }
        return null;
      }
    }),
  ],

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
        path: '/',
        secure: process.env.NODE_ENV !== 'development',
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
        path: '/',
        secure: process.env.NODE_ENV !== 'development',
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
        path: '/',
        secure: process.env.NODE_ENV !== 'development',
      }
    }
  },
  basePath: "/api/auth",
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/(examples)/middleware-example") return !!auth
      return true
    },
    jwt({ token, trigger, session, account }) {
      if (trigger === "update") token.name = session.user.name
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token }
      }
      return token
    },
    async session({ session, token }) {
      if (token?.accessToken) session.accessToken = token.accessToken
      return session
    },
    // Handle account linking and sign-in
    async signIn({ user, account }) {
      // Log the sign-in attempt
      console.log("[auth][signIn] Sign-in attempt for:", user?.email, "with provider:", account?.provider);

      // In Auth.js v5, we need to explicitly return true to allow sign-in
      // This will fix the OAuthAccountNotLinked error
      console.log("[auth][signIn] Allowing sign-in for user:", user?.email);

      // Always return true to allow sign-in
      return true;
    },
    async redirect({ url }) {
      // Use our dynamic base URL (without request context since it's not available in this callback)
      const dynamicBaseUrl = getBaseUrl();
      console.log(`[auth] Redirect - URL: ${url}, BaseUrl: ${dynamicBaseUrl}`);

      // Get allowed origins from environment variable
      const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3775,https://vishal.biyani.xyz')
        .split(',').map(origin => origin.trim());

      console.log(`[auth] Allowed origins: ${allowedOrigins.join(', ')}`);

      // Check if the URL starts with any of the allowed origins
      for (const origin of allowedOrigins) {
        if (url.startsWith(origin)) {
          console.log(`[auth] Allowing redirect to allowed origin: ${url}`);
          return url;
        }
      }

      // If the URL contains auth-callback, it's from our portfolio app
      if (url.includes('auth-callback')) {
        console.log(`[auth] Detected auth-callback in URL: ${url}`);
        // Extract the origin from the URL
        try {
          const urlObj = new URL(url);
          console.log(`[auth] Extracted origin: ${urlObj.origin}`);
          return url;
        } catch (error) {
          console.error(`[auth] Error parsing URL: ${error}`);
        }
      }

      // If the URL is relative, prepend the dynamic base URL
      if (url.startsWith('/')) {
        console.log(`[auth] Relative URL, prepending base URL: ${dynamicBaseUrl}${url}`);
        return `${dynamicBaseUrl}${url}`;
      }

      try {
        const urlOrigin = new URL(url).origin;

        // Allow redirects to any vercel.app domain (for preview deployments)
        if (urlOrigin.includes('vercel.app')) {
          console.log(`[auth] Allowing redirect to Vercel preview: ${url}`);
          return url;
        }

        // If the URL is absolute but on the same origin as the site, allow it
        if (urlOrigin === dynamicBaseUrl) {
          console.log(`[auth] Same origin URL, allowing: ${url}`);
          return url;
        }

        // Special case for localhost development
        if (urlOrigin.includes('localhost')) {
          console.log(`[auth] Localhost URL, allowing: ${url}`);
          return url;
        }
      } catch (error) {
        console.error(`[auth] Error parsing URL: ${error}`);
      }

      // Otherwise, redirect to the dynamic base URL
      console.log(`[auth] Defaulting to base URL: ${dynamicBaseUrl}`);
      return dynamicBaseUrl;
    },
  },
  experimental: { enableWebAuthn: true },
  events: {
    // This event is triggered when a user signs in with a new provider
    // but the email is already associated with another account
    async linkAccount({ user, account }) {
      console.log("[auth][linkAccount] Linking account for user:", user?.email, "with provider:", account?.provider);
      // In Auth.js v5, returning nothing (or undefined) from this event handler
      // allows the account to be linked automatically
    },
    // This event is triggered when a user signs in
    async signIn({ user, account, isNewUser }) {
      console.log("[auth][event:signIn] User signed in:", user?.email, "with provider:", account?.provider);
      if (isNewUser) {
        console.log("[auth][event:signIn] This is a new user");
      }
    },
  },
})

declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}