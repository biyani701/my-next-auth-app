---
sidebar_position: 1
---

# Auth.js Portfolio Authentication

Welcome to the documentation for the Auth.js implementation in the Portfolio project. This guide will help you understand how authentication is set up, how to configure providers, and how to add new authentication methods.

## Overview

This project uses **Auth.js V5** (formerly NextAuth.js) to provide OAuth authentication for a React portfolio application. The authentication server runs on a separate domain and provides authentication services for the portfolio website.

### Features

- **Multiple OAuth Providers**: GitHub, Google, Facebook, and Auth0
- **Custom UI**: Personalized sign-in page with provider-specific styling
- **CORS Support**: Cross-Origin authentication between the auth server and portfolio
- **Error Handling**: Custom error pages for authentication issues

## Architecture

The authentication system consists of two main components:

1. **Auth Server**: A Next.js application running Auth.js V5 that handles authentication requests
2. **Portfolio Client**: A React application that consumes the authentication services

The Auth Server is deployed on Vercel, while the Portfolio Client is hosted on GitHub Pages.

## Getting Started

To use this authentication system in your own project, you'll need:

- Node.js 18.0 or later
- Next.js 14.0 or later
- Auth.js V5

### Installation

1. Clone the repository:

```bash
git clone https://github.com/vishalbiyani/next-auth-example.git
cd next-auth-example
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables in `.env.local`:

```
# Auth.js Secret
AUTH_SECRET=your-secret-key

# GitHub
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret

# Google
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Facebook
AUTH_FACEBOOK_ID=your-facebook-client-id
AUTH_FACEBOOK_SECRET=your-facebook-client-secret

# Auth0
AUTH_AUTH0_ID=your-auth0-client-id
AUTH_AUTH0_SECRET=your-auth0-client-secret
AUTH_AUTH0_ISSUER=https://your-auth0-domain.auth0.com
```

4. Start the development server:

```bash
npm run dev
```

The authentication server will be available at http://localhost:3000.
