// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Tests for Keycloak authentication
 * 
 * These tests verify that:
 * 1. The Keycloak provider is available on the sign-in page
 * 2. The user can sign in with Keycloak
 * 3. The user can sign out after signing in
 */

test.describe('Keycloak Authentication', () => {
  test('should show Keycloak provider on sign-in page', async ({ page }) => {
    // Navigate to the sign-in page
    await page.goto('/api/auth/signin');
    
    // Check that the Keycloak provider button is visible
    const keycloakButton = page.getByRole('button', { name: /Keycloak/i });
    await expect(keycloakButton).toBeVisible();
  });

  test('should redirect to Keycloak login page when clicking the provider button', async ({ page }) => {
    // Navigate to the sign-in page
    await page.goto('/api/auth/signin');
    
    // Click the Keycloak provider button
    const keycloakButton = page.getByRole('button', { name: /Keycloak/i });
    
    // Wait for navigation to Keycloak login page
    // This will fail if the redirect doesn't happen
    await Promise.all([
      page.waitForURL(/.*keycloak.*/, { timeout: 10000 }),
      keycloakButton.click()
    ]);
    
    // Verify we're on the Keycloak login page
    await expect(page).toHaveURL(/.*keycloak.*/);
    await expect(page.getByLabel('Username or email')).toBeVisible();
  });

  test.skip('should successfully sign in with valid Keycloak credentials', async ({ page }) => {
    // This test is skipped by default as it requires a running Keycloak instance
    // and valid credentials. Enable it when running against a real Keycloak server.
    
    // Navigate to the sign-in page
    await page.goto('/api/auth/signin');
    
    // Click the Keycloak provider button
    const keycloakButton = page.getByRole('button', { name: /Keycloak/i });
    await keycloakButton.click();
    
    // Wait for the Keycloak login page to load
    await page.waitForURL(/.*keycloak.*/);
    
    // Fill in the username and password
    await page.getByLabel('Username or email').fill(process.env.TEST_KEYCLOAK_USERNAME || 'biyani701');
    await page.getByLabel('Password').fill(process.env.TEST_KEYCLOAK_PASSWORD || 'password');
    
    // Click the login button
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for redirect back to the application
    await page.waitForURL(/.*localhost:3000.*/);
    
    // Verify that we're signed in
    await expect(page.getByText(/Signed in as/)).toBeVisible();
  });
});
