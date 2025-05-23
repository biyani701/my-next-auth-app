// @ts-check
const { test, expect } = require("@playwright/test");

/**
 * Tests for Keycloak authentication
 *
 * These tests verify that:
 * 1. The Keycloak provider is available on the sign-in page
 * 2. The user can sign in with Keycloak
 * 3. The user can sign out after signing in
 */

test.describe("Keycloak Authentication", () => {
  // Before each test, set up mocks for the authentication
  test.beforeEach(async ({ page }) => {
    // We'll use localStorage to enable the test mode
    await page.goto("/");
    await page.evaluate(() => {
      // localStorage.setItem("auth_test_mode", "false");
    });
  });

  test("should show Keycloak provider on sign-in page", async ({ page }) => {
    // Navigate to the sign-in page
    await page.goto("/auth/signin");

    // Check that the Keycloak provider button is visible
    const keycloakButton = page.getByRole("button", {
      name: /Continue with Keycloak/i,
    });
    await expect(keycloakButton).toBeVisible();
  });

  test("should be able to sign in with Keycloak", async ({ page }) => {
    await page.goto("/auth/signin");    

    // Click the Keycloak button
    // await page.getByRole("button", { name: /Continue with Keycloak/i }).click();
    const keycloakButton = page.getByRole("button", {
      name: /Continue with Keycloak/i,
    });
    await expect(keycloakButton).toBeVisible();
    await keycloakButton.click();

    // Debug information
    await page.waitForTimeout(300); // Give time for redirect (not needed in real tests)
    
    console.log("Redirected to:", page.url());
    // End Debug

    // Wait for Keycloak login page
    await page.waitForURL(/.*\/realms\/auth-js\/.*/);

    // Fill in Keycloak login credentials
    await page.fill("input#username", "biyani701");
    await page.fill("input#password", "password");
    await page.click('input[type="submit"]');

    // Wait for redirect back to your app
    await page.waitForURL("http://localhost:3000/");

    // Verify login
    await expect(page.getByText(/signed in as/i)).toBeVisible();
  });

  test.skip("should redirect to Keycloak login page when clicking the provider button", async ({
    page,
  }) => {
    // This test is skipped because it requires a properly configured Keycloak provider
    // Navigate to the sign-in page
    await page.goto("/auth/signin");

    // Mock the Keycloak redirect
    await page.route("**/api/auth/signin/keycloak**", async (route) => {
      // Redirect to a mock Keycloak login page
      await route.fulfill({
        status: 302,
        headers: {
          Location:
            "http://localhost:9090/realms/auth-js/protocol/openid-connect/auth",
        },
      });
    });

    // Mock the Keycloak login page
    await page.route(
      "**/realms/auth-js/protocol/openid-connect/auth**",
      async (route) => {
        // Serve a mock Keycloak login page
        await route.fulfill({
          status: 200,
          contentType: "text/html",
          body: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Keycloak Login</title>
            </head>
            <body>
              <form>
                <label for="username">Username or email</label>
                <input id="username" name="username" type="text">
                <label for="password">Password</label>
                <input id="password" name="password" type="password">
                <button type="submit">Sign In</button>
              </form>
            </body>
          </html>
        `,
        });
      }
    );

    // Click the Keycloak provider button
    const keycloakButton = page.getByRole("button", {
      name: /Continue with Keycloak/i,
    });
    await keycloakButton.click();

    // Verify we're on the Keycloak login page
    await expect(page).toHaveURL(/.*keycloak.*/);
    await expect(page.getByLabel("Username or email")).toBeVisible();
  });

  test.skip("should successfully sign in with valid Keycloak credentials", async ({
    page,
  }) => {
    // This test is skipped because it requires a properly configured Keycloak provider
    // Navigate to the sign-in page
    await page.goto("/auth/signin");

    // Mock the Keycloak redirect
    await page.route("**/api/auth/signin/keycloak**", async (route) => {
      // Redirect to a mock Keycloak login page
      await route.fulfill({
        status: 302,
        headers: {
          Location:
            "http://localhost:9090/realms/auth-js/protocol/openid-connect/auth",
        },
      });
    });

    // Mock the Keycloak login page
    await page.route(
      "**/realms/auth-js/protocol/openid-connect/auth**",
      async (route) => {
        // Serve a mock Keycloak login page
        await route.fulfill({
          status: 200,
          contentType: "text/html",
          body: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Keycloak Login</title>
            </head>
            <body>
              <form id="kc-form" action="http://localhost:3000/api/auth/callback/keycloak" method="post">
                <label for="username">Username or email</label>
                <input id="username" name="username" type="text">
                <label for="password">Password</label>
                <input id="password" name="password" type="password">
                <button type="submit">Sign In</button>
              </form>
            </body>
          </html>
        `,
        });
      }
    );

    // Mock the callback from Keycloak
    await page.route("**/api/auth/callback/keycloak**", async (route) => {
      // Create a mock session
      await page.evaluate(() => {
        // Create a mock session in localStorage
        const mockSession = {
          user: {
            name: "Keycloak User",
            email: "keycloak@example.com",
            image: null,
            role: "user",
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        };

        // Store the mock session
        localStorage.setItem(
          "next-auth.session-token",
          JSON.stringify(mockSession)
        );
      });

      // Redirect back to the home page
      await route.fulfill({
        status: 302,
        headers: {
          Location: "http://localhost:3000/",
        },
      });
    });

    // Click the Keycloak provider button
    const keycloakButton = page.getByRole("button", {
      name: /Continue with Keycloak/i,
    });
    await keycloakButton.click();

    // Wait for the Keycloak login page to load
    await expect(page).toHaveURL(/.*keycloak.*/);

    // Fill in the username and password
    await page.getByLabel("Username or email").fill("biyani701");
    await page.getByLabel("Password").fill("password");

    // Click the login button and wait for navigation
    await page.getByRole("button", { name: "Sign In" }).click();

    // Navigate to the home page to see if we're signed in
    await page.goto("/");

    // Verify that we're signed in
    await expect(page.getByText(/Keycloak User/i)).toBeVisible();
  });
});
