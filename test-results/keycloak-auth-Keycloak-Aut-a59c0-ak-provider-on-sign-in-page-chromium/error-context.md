# Test info

- Name: Keycloak Authentication >> should show Keycloak provider on sign-in page
- Location: C:\vishal\git-repo\next-auth-example\tests\keycloak-auth.spec.js:14:3

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByRole('button', { name: /Keycloak/i })
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByRole('button', { name: /Keycloak/i })

    at C:\vishal\git-repo\next-auth-example\tests\keycloak-auth.spec.js:20:34
```

# Page snapshot

```yaml
- link "Skip to content":
  - /url: "#start-of-content"
- banner:
  - link "Homepage":
    - /url: https://github.com/
- main:
  - img "Local App Port 3000 logo"
  - paragraph:
    - text: Sign in to
    - strong: GitHub
    - text: to continue to
    - strong: Local App Port 3000
  - text: Username or email address
  - textbox "Username or email address"
  - text: Password
  - textbox "Password"
  - link "Forgot password?":
    - /url: /password_reset
  - button "Sign in"
  - heading "Password login alternatives" [level=2]
  - paragraph:
    - button "Sign in with a passkey"
  - paragraph:
    - text: New to GitHub?
    - link "Create an account":
      - /url: /join?return_to=%2Flogin%2Foauth%2Fauthorize%3Fclient_id%3DOv23liMhMP1kGBGvjldY%26code_challenge%3Davuu7N5hLODXck7NEo6qiYTkVopju7d5tmLyQ05Dg-0%26code_challenge_method%3DS256%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A3000%252Fapi%252Fauth%252Fcallback%252Fgithub%26response_type%3Dcode%26scope%3Dread%253Auser%2Buser%253Aemail&source=oauth
- contentinfo:
  - list:
    - listitem:
      - link "Terms":
        - /url: https://docs.github.com/site-policy/github-terms/github-terms-of-service
    - listitem:
      - link "Privacy":
        - /url: https://docs.github.com/site-policy/privacy-policies/github-privacy-statement
    - listitem:
      - link "Docs":
        - /url: https://docs.github.com
    - listitem:
      - link "Contact GitHub Support":
        - /url: https://support.github.com
    - listitem:
      - button "Manage cookies"
    - listitem:
      - button "Do not share my personal information"
```

# Test source

```ts
   1 | // @ts-check
   2 | const { test, expect } = require('@playwright/test');
   3 |
   4 | /**
   5 |  * Tests for Keycloak authentication
   6 |  * 
   7 |  * These tests verify that:
   8 |  * 1. The Keycloak provider is available on the sign-in page
   9 |  * 2. The user can sign in with Keycloak
  10 |  * 3. The user can sign out after signing in
  11 |  */
  12 |
  13 | test.describe('Keycloak Authentication', () => {
  14 |   test('should show Keycloak provider on sign-in page', async ({ page }) => {
  15 |     // Navigate to the sign-in page
  16 |     await page.goto('/api/auth/signin');
  17 |     
  18 |     // Check that the Keycloak provider button is visible
  19 |     const keycloakButton = page.getByRole('button', { name: /Keycloak/i });
> 20 |     await expect(keycloakButton).toBeVisible();
     |                                  ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  21 |   });
  22 |
  23 |   test('should redirect to Keycloak login page when clicking the provider button', async ({ page }) => {
  24 |     // Navigate to the sign-in page
  25 |     await page.goto('/api/auth/signin');
  26 |     
  27 |     // Click the Keycloak provider button
  28 |     const keycloakButton = page.getByRole('button', { name: /Keycloak/i });
  29 |     
  30 |     // Wait for navigation to Keycloak login page
  31 |     // This will fail if the redirect doesn't happen
  32 |     await Promise.all([
  33 |       page.waitForURL(/.*keycloak.*/, { timeout: 10000 }),
  34 |       keycloakButton.click()
  35 |     ]);
  36 |     
  37 |     // Verify we're on the Keycloak login page
  38 |     await expect(page).toHaveURL(/.*keycloak.*/);
  39 |     await expect(page.getByLabel('Username or email')).toBeVisible();
  40 |   });
  41 |
  42 |   test.skip('should successfully sign in with valid Keycloak credentials', async ({ page }) => {
  43 |     // This test is skipped by default as it requires a running Keycloak instance
  44 |     // and valid credentials. Enable it when running against a real Keycloak server.
  45 |     
  46 |     // Navigate to the sign-in page
  47 |     await page.goto('/api/auth/signin');
  48 |     
  49 |     // Click the Keycloak provider button
  50 |     const keycloakButton = page.getByRole('button', { name: /Keycloak/i });
  51 |     await keycloakButton.click();
  52 |     
  53 |     // Wait for the Keycloak login page to load
  54 |     await page.waitForURL(/.*keycloak.*/);
  55 |     
  56 |     // Fill in the username and password
  57 |     await page.getByLabel('Username or email').fill(process.env.TEST_KEYCLOAK_USERNAME || 'biyani701');
  58 |     await page.getByLabel('Password').fill(process.env.TEST_KEYCLOAK_PASSWORD || 'password');
  59 |     
  60 |     // Click the login button
  61 |     await page.getByRole('button', { name: 'Sign In' }).click();
  62 |     
  63 |     // Wait for redirect back to the application
  64 |     await page.waitForURL(/.*localhost:3000.*/);
  65 |     
  66 |     // Verify that we're signed in
  67 |     await expect(page.getByText(/Signed in as/)).toBeVisible();
  68 |   });
  69 | });
  70 |
```