---
sidebar_position: 4
---

# Testing Authentication

This page explains how to test authentication in your application using Playwright and the Keycloak and Credentials providers.

## Setting Up Playwright

[Playwright](https://playwright.dev/) is a powerful testing framework that allows you to automate browser interactions. To set up Playwright for testing Auth.js, follow these steps:

1. **Install Playwright**:

```bash
npm install -D @playwright/test
```

2. **Create a Playwright configuration file**:

```javascript
// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

## Testing with Keycloak

Keycloak is an open-source identity and access management solution that can be used for testing authentication. Here's how to set it up and use it for testing:

### Setting Up Keycloak for Testing

1. **Run Keycloak locally using Docker**:

```bash
docker run -p 9090:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
```

2. **Create a realm and user**:
   - Create a realm named `auth-js`
   - Create a user with username `biyani701` and password `password`
   - Create a client with client ID `my-next-auth-app`

3. **Configure environment variables**:

```
# Keycloak OAuth
AUTH_KEYCLOAK_ID=my-next-auth-app
AUTH_KEYCLOAK_SECRET=your-client-secret
AUTH_KEYCLOAK_ISSUER=http://localhost:9090/realms/auth-js

# Test user credentials
TEST_KEYCLOAK_USERNAME=biyani701
TEST_KEYCLOAK_PASSWORD=password
```

### Writing Keycloak Tests

Here's an example of a Playwright test for Keycloak authentication:

```javascript
// tests/keycloak-auth.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Keycloak Authentication', () => {
  test('should show Keycloak provider on sign-in page', async ({ page }) => {
    await page.goto('/api/auth/signin');
    const keycloakButton = page.getByRole('button', { name: /Keycloak/i });
    await expect(keycloakButton).toBeVisible();
  });

  test('should redirect to Keycloak login page when clicking the provider button', async ({ page }) => {
    await page.goto('/api/auth/signin');
    const keycloakButton = page.getByRole('button', { name: /Keycloak/i });
    
    await Promise.all([
      page.waitForURL(/.*keycloak.*/, { timeout: 10000 }),
      keycloakButton.click()
    ]);
    
    await expect(page).toHaveURL(/.*keycloak.*/);
    await expect(page.getByLabel('Username or email')).toBeVisible();
  });

  test.skip('should successfully sign in with valid Keycloak credentials', async ({ page }) => {
    await page.goto('/api/auth/signin');
    const keycloakButton = page.getByRole('button', { name: /Keycloak/i });
    await keycloakButton.click();
    
    await page.waitForURL(/.*keycloak.*/);
    await page.getByLabel('Username or email').fill(process.env.TEST_KEYCLOAK_USERNAME || 'biyani701');
    await page.getByLabel('Password').fill(process.env.TEST_KEYCLOAK_PASSWORD || 'password');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await page.waitForURL(/.*localhost:3000.*/);
    await expect(page.getByText(/Signed in as/)).toBeVisible();
  });
});
```

## Testing with Credentials Provider

The Credentials provider allows you to test authentication without external dependencies. Here's how to use it:

### Setting Up Credentials Provider for Testing

1. **Add the Credentials provider to your Auth.js configuration**:

```javascript
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Other providers...
    Credentials({
      id: "test-credentials",
      name: "Test Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password) {
          return {
            id: "1",
            name: "Test User",
            email: credentials.email,
          };
        }
        return null;
      }
    }),
  ],
  // Rest of your configuration
})
```

### Writing Credentials Tests

Here's an example of a Playwright test for Credentials authentication:

```javascript
// tests/credentials-auth.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Credentials Authentication for Testing', () => {
  test('should be able to sign in with test credentials', async ({ page }) => {
    await page.goto('/api/auth/signin');
    
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: /sign in with credentials/i }).click();
    
    await page.waitForURL('/');
    await expect(page.getByText(/signed in as/i)).toBeVisible();
  });

  test('should be able to sign out', async ({ page }) => {
    // First sign in
    await page.goto('/api/auth/signin');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: /sign in with credentials/i }).click();
    
    await page.waitForURL('/');
    
    // Then sign out
    await page.getByRole('button', { name: /sign out/i }).click();
    await expect(page.getByText(/not signed in/i)).toBeVisible();
  });
});
```

## Running Tests

To run the tests, use the following command:

```bash
npx playwright test
```

To run a specific test file:

```bash
npx playwright test tests/keycloak-auth.spec.js
```

To run tests in debug mode:

```bash
npx playwright test --debug
```
