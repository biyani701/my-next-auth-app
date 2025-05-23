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
      return vercelKVDriver({
        url: process.env.AUTH_KV_REST_API_URL,
        token: process.env.AUTH_KV_REST_API_TOKEN,
        env: false,
      });
    } else {
      // Fall back to memory driver if not on Vercel or missing KV config
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
  // Use PrismaAdapter if DATABASE_URL is set, otherwise fall back to memory storage
  adapter: process.env.DATABASE_URL
    ? (() => {
        console.log('[auth] Using database storage with Prisma adapter');
        return PrismaAdapter(prisma);
      })()
    : (() => {
        console.log('[auth] Using memory storage (no database configuration found)');
        return UnstorageAdapter(storage);
      })(),
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
      // Account linking is now handled in the signIn callback
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      // Account linking is now handled in the signIn callback
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      // Account linking is now handled in the signIn callback
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // Account linking is now handled in the signIn callback
    }),
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER,
      name: "Keycloak",
      // Account linking is now handled in the signIn callback
    }),
    // Add test credentials provider for testing
    Credentials({
      id: "test-credentials",
      name: "Test Credentials",
      credentials: {
        email: {
          label: "Email", type: "email"
        },
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
  // Use SESSION_STRATEGY env var to determine session strategy (jwt or database)
  session: {
    strategy: (process.env.SESSION_STRATEGY === "database" ? "database" : "jwt")
  },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl

      // Require authentication for middleware example
      if (pathname === "/middleware-example") {
        return !!auth
      }

      // Require admin role for admin pages
      if (pathname.startsWith("/admin")) {
        return auth?.user?.role === "admin"
      }

      // Require moderator or admin role for moderator pages
      if (pathname.startsWith("/moderator")) {
        return ["admin", "moderator"].includes(auth?.user?.role as string)
      }

      // Allow access to all other pages
      return true
    },
    async jwt({ token, trigger, session, account, user }) {
      // If this is the first sign in, add the user's role to the token
      if (user) {
        token.role = user.role;
      }

      // Handle session updates
      if (trigger === "update") {
        token.name = session.user.name;
        // Allow role updates if provided in the session update
        if (session.user.role) {
          token.role = session.user.role;
        }
      }

      // Handle Keycloak tokens
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token }
      }

      return token
    },
    async session({ session, token }) {
      // Add role and accessToken to the session
      if (token?.role) session.user.role = token.role;
      if (token?.accessToken) session.accessToken = token.accessToken;
      return session
    },
    // Handle account linking and sign-in
    async signIn({ user, account, profile, email }) {
      // Log the sign-in attempt
      console.log("[auth][signIn] Sign-in attempt for:", user?.email, "with provider:", account?.provider);

      try {
        // If the user is signing in with an OAuth provider and we have their email
        if (account?.provider !== "credentials" && user?.email) {
          // Check if a user with this email already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { accounts: true }
          });

          console.log("[auth][signIn] Existing user check:", existingUser ? "Found" : "Not found");

          if (existingUser) {
            // Check if the user already has an account with this provider
            const existingAccount = existingUser.accounts.find(
              (acc) => acc.provider === account.provider
            );

            if (!existingAccount) {
              console.log("[auth][signIn] Linking new provider to existing account");

              // Manually create the account link
              try {
                // Make sure account is defined
                if (account) {
                  await prisma.account.create({
                    data: {
                      userId: existingUser.id,
                      type: account.type || "oauth",
                      provider: account.provider,
                      providerAccountId: account.providerAccountId,
                      refresh_token: account.refresh_token || null,
                      access_token: account.access_token || null,
                      expires_at: account.expires_at || null,
                      token_type: account.token_type || null,
                      scope: account.scope || null,
                      id_token: account.id_token || null,
                      session_state: account.session_state?.toString() || null
                    }
                  });
                }

                console.log("[auth][signIn] Successfully linked account for user:", existingUser.email);

                // Return the existing user's ID to use this user instead of creating a new one
                // This tells Auth.js to use the existing user instead of creating a new one
                return true;
              } catch (linkError) {
                console.error("[auth][signIn] Error linking account:", linkError);
                // If there's an error linking the account, still allow sign-in
                return true;
              }
            } else {
              console.log("[auth][signIn] User already has an account with this provider");
            }
          }
        }

        // For all other cases, allow sign-in
        console.log("[auth][signIn] Allowing sign-in for user:", user?.email);
        return true;
      } catch (error) {
        console.error("[auth][signIn] Error during sign-in:", error);
        // Still allow sign-in even if there was an error checking for existing accounts
        return true;
      }
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

      try {
        // Check if the user exists in the database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { accounts: true }
        });

        if (dbUser) {
          console.log(`[auth][linkAccount] Found user in database with ${dbUser.accounts.length} linked accounts`);

          // If this is the first account being linked, update the user's role to match what's in the database
          if (dbUser.accounts.length === 0 && dbUser.role) {
            console.log(`[auth][linkAccount] User has role '${dbUser.role}' in database`);
          }

          // Check if there are other users with the same email but different IDs
          if (user.email) {
            const otherUsersWithSameEmail = await prisma.user.findMany({
              where: {
                email: user.email,
                NOT: { id: user.id }
              },
              include: { accounts: true }
            });

            if (otherUsersWithSameEmail.length > 0) {
              console.log(`[auth][linkAccount] Found ${otherUsersWithSameEmail.length} other users with the same email`);

              // Log the accounts for debugging
              for (const otherUser of otherUsersWithSameEmail) {
                console.log(`[auth][linkAccount] User ${otherUser.id} has ${otherUser.accounts.length} accounts`);
                for (const acc of otherUser.accounts) {
                  console.log(`[auth][linkAccount] - Provider: ${acc.provider}, ID: ${acc.providerAccountId}`);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("[auth][linkAccount] Error checking user accounts:", error);
      }

      // In Auth.js v5, returning nothing (or undefined) from this event handler
      // allows the account to be linked automatically
    },
    // This event is triggered when a user signs in
    async signIn({ user, account, isNewUser }) {
      console.log("[auth][event:signIn] User signed in:", user?.email, "with provider:", account?.provider);

      if (isNewUser) {
        console.log("[auth][event:signIn] This is a new user");

        // For development, automatically set the first user as admin
        if (process.env.NODE_ENV === "development") {
          try {
            // Check if this is the first user
            const userCount = await prisma.user.count();

            if (userCount === 1) {
              console.log("[auth][event:signIn] First user detected, setting as admin");

              // Update the user's role to admin
              await prisma.user.update({
                where: { id: user.id },
                data: { role: "admin" }
              });

              console.log("[auth][event:signIn] User set as admin:", user.email);
            }
          } catch (error) {
            console.error("[auth][event:signIn] Error setting admin role:", error);
          }
        }
      }
    },
  },
})

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }

  interface User {
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    role?: string
  }
}