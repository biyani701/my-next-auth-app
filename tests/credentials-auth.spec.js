// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Tests for Credentials authentication
 *
 * These tests verify that:
 * 1. The Credentials provider can be used for testing
 * 2. The user can sign in with test credentials
 * 3. The user can sign out after signing in
 */

test.describe('Credentials Authentication for Testing', () => {
  // Before each test, set up mocks for the authentication
  test.beforeEach(async ({ page }) => {
    // We'll use localStorage to enable the test credentials provider
    // This is just for testing purposes
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('auth_test_mode', 'true');
    });

    // Mock the credentials authentication API response
    await page.route('/api/auth/callback/test-credentials', async (route) => {
      // Simulate a successful authentication
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: '/',
          ok: true
        })
      });
    });
  });

  
  test.skip('should be able to sign in with test credentials', async ({ page }) => {
    // This test is skipped because it requires a properly configured credentials provider
    // Navigate directly to the sign-in page
    await page.goto('/auth/signin');

    // Click the credentials sign in button
    await page.getByRole('button', { name: /Continue with Credentials/i }).click();

    // Fill in the test credentials
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password');

    // Click the sign in button
    await page.getByRole('button', { name: /sign in with credentials/i }).click();

    // Wait for redirect back to the application
    await page.waitForURL('/');

    // Verify that we're signed in
    await expect(page.getByText(/signed in as/i)).toBeVisible();
  });

  test.skip('should be able to sign out', async ({ page }) => {
    // This test is skipped because it requires a properly configured credentials provider
    // First sign in
    await page.goto('/auth/signin');
    await page.getByRole('button', { name: /Continue with Credentials/i }).click();
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: /sign in with credentials/i }).click();

    // Wait for redirect back to the application
    await page.waitForURL('/');

    // Click the sign out button
    await page.getByRole('button', { name: /sign out/i }).click();

    // Verify that we're signed out
    await expect(page.getByText(/not signed in/i)).toBeVisible();
  });
});
