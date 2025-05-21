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
import { createStorage } from "unstorage"
import memoryDriver from "unstorage/drivers/memory"
import vercelKVDriver from "unstorage/drivers/vercel-kv"
import { UnstorageAdapter } from "@auth/unstorage-adapter"

// Configure storage based on environment and available configuration
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
      console.log('[auth] Using memory storage (no Vercel KV configuration found)');
      return memoryDriver();
    }
  })(),
})

// We'll use the standard adapter but handle account linking in the callbacks

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  theme: {
    logo: "/logo.png",
    brandColor: "#0070f3",
    buttonText: "#ffffff",
  },
  adapter: UnstorageAdapter(storage),
  trustHost: true,
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
    GitHub,
    Google,
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
        sameSite: 'none',
        path: '/',
        secure: true,
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      }
    }
  },
  basePath: "/api/auth",
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
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

      // This is the key to fixing the OAuthAccountNotLinked error
      // By returning true, we're telling Auth.js to allow the sign-in
      // even if there's another account with the same email
      return true
    },
    async redirect({ url, baseUrl }) {
      console.log(`[auth] Redirect - URL: ${url}, BaseUrl: ${baseUrl}`);

      // Allow redirects to the portfolio app (development)
      if (url.startsWith('http://localhost:3775')) {
        console.log(`[auth] Allowing redirect to portfolio app (dev): ${url}`);
        return url;
      }

      // Allow redirects to the portfolio app (production)
      if (url.startsWith('https://vishal.biyani.xyz')) {
        console.log(`[auth] Allowing redirect to portfolio app (prod): ${url}`);
        return url;
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

      // If the URL is relative, prepend the base URL
      if (url.startsWith('/')) {
        console.log(`[auth] Relative URL, prepending base URL: ${baseUrl}${url}`);
        return `${baseUrl}${url}`;
      }

      // If the URL is absolute but on the same origin as the site, allow it
      try {
        const urlOrigin = new URL(url).origin;
        if (urlOrigin === baseUrl) {
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

      // Otherwise, redirect to the base URL
      console.log(`[auth] Defaulting to base URL: ${baseUrl}`);
      return baseUrl;
    },
  },
  experimental: { enableWebAuthn: true },
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