# Test info

- Name: Credentials Authentication for Testing >> should be able to sign in with test credentials
- Location: C:\vishal\git-repo\next-auth-example\tests\credentials-auth.spec.js:24:3

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: /sign in/i })

    at C:\vishal\git-repo\next-auth-example\tests\credentials-auth.spec.js:29:56
```

# Page snapshot

```yaml
- banner:
  - link "Home":
    - /url: /
    - button "Home":
      - img "Home"
  - navigation "Main":
    - list:
      - listitem:
        - button "Server Side"
      - listitem:
        - link "Client Side":
          - /url: /client-example
  - button "Sign In"
- main:
  - img "Portfolio Logo"
  - heading "Portfolio Authentication" [level=1]
  - paragraph: Sign in to access your portfolio dashboard
  - heading "Choose a sign-in method" [level=2]
  - button "Continue with GitHub":
    - img
    - text: Continue with GitHub
  - button "Continue with Google":
    - img
    - text: Continue with Google
  - button "Continue with Facebook":
    - img
    - text: Continue with Facebook
  - button "Continue with Auth0":
    - img
    - text: Continue with Auth0
  - button "Continue with Keycloak":
    - img
    - text: Continue with Keycloak
  - button "Continue with Credentials":
    - img
    - text: Continue with Credentials
- contentinfo:
  - link "Documentation":
    - /url: https://nextjs.authjs.dev
    - text: Documentation
    - img
  - link "NPM":
    - /url: https://www.npmjs.com/package/next-auth
    - text: NPM
    - img
  - link "Source on GitHub":
    - /url: https://github.com/nextauthjs/next-auth/tree/main/apps/examples/nextjs
    - text: Source on GitHub
    - img
  - link "Policy":
    - /url: /policy
  - img "Auth.js Logo"
  - link "5.0.0-beta.28":
    - /url: https://npmjs.org/package/next-auth
    - text: 5.0.0-beta.28
    - img
- alert
- button "Open Next.js Dev Tools":
  - img
```

# Test source

```ts
   1 | // @ts-check
   2 | const { test, expect } = require('@playwright/test');
   3 |
   4 | /**
   5 |  * Tests for Credentials authentication
   6 |  * 
   7 |  * These tests verify that:
   8 |  * 1. The Credentials provider can be used for testing
   9 |  * 2. The user can sign in with test credentials
  10 |  * 3. The user can sign out after signing in
  11 |  */
  12 |
  13 | test.describe('Credentials Authentication for Testing', () => {
  14 |   // Before each test, add the Credentials provider for testing
  15 |   test.beforeEach(async ({ page }) => {
  16 |     // We'll use localStorage to enable the test credentials provider
  17 |     // This is just for testing purposes
  18 |     await page.goto('/');
  19 |     await page.evaluate(() => {
  20 |       localStorage.setItem('auth_test_mode', 'true');
  21 |     });
  22 |   });
  23 |
  24 |   test('should be able to sign in with test credentials', async ({ page }) => {
  25 |     // Navigate to the home page
  26 |     await page.goto('/');
  27 |     
  28 |     // Click the sign in link
> 29 |     await page.getByRole('link', { name: /sign in/i }).click();
     |                                                        ^ Error: locator.click: Test timeout of 30000ms exceeded.
  30 |     
  31 |     // Check if we're redirected to the sign-in page
  32 |     await expect(page).toHaveURL(/.*\/api\/auth\/signin.*/);
  33 |     
  34 |     // Fill in the test credentials
  35 |     await page.getByLabel('Email').fill('test@example.com');
  36 |     await page.getByLabel('Password').fill('password');
  37 |     
  38 |     // Click the sign in button
  39 |     await page.getByRole('button', { name: /sign in with credentials/i }).click();
  40 |     
  41 |     // Wait for redirect back to the application
  42 |     await page.waitForURL('/');
  43 |     
  44 |     // Verify that we're signed in
  45 |     await expect(page.getByText(/signed in as/i)).toBeVisible();
  46 |   });
  47 |
  48 |   test('should be able to sign out', async ({ page }) => {
  49 |     // First sign in
  50 |     await page.goto('/');
  51 |     await page.getByRole('link', { name: /sign in/i }).click();
  52 |     await page.getByLabel('Email').fill('test@example.com');
  53 |     await page.getByLabel('Password').fill('password');
  54 |     await page.getByRole('button', { name: /sign in with credentials/i }).click();
  55 |     
  56 |     // Wait for redirect back to the application
  57 |     await page.waitForURL('/');
  58 |     
  59 |     // Click the sign out button
  60 |     await page.getByRole('button', { name: /sign out/i }).click();
  61 |     
  62 |     // Verify that we're signed out
  63 |     await expect(page.getByText(/not signed in/i)).toBeVisible();
  64 |   });
  65 | });
  66 |
```