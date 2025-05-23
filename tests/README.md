# Playwright Tests for Auth.js

This directory contains Playwright tests for the Auth.js authentication system.

## Running Tests

To run all tests:

```bash
npx playwright test
```

To run a specific test file:

```bash
npx playwright test tests/keycloak-auth.spec.js
```

To run tests with a UI:

```bash
npx playwright test --ui
```

## Test Structure

The tests are organized into two main categories:

1. **Keycloak Authentication Tests** (`keycloak-auth.spec.js`)
   - Tests for the Keycloak authentication provider
   - Verifies that the Keycloak provider button is visible on the sign-in page
   - Tests for redirecting to the Keycloak login page (skipped by default)
   - Tests for signing in with Keycloak credentials (skipped by default)

2. **Credentials Authentication Tests** (`credentials-auth.spec.js`)
   - Tests for the credentials authentication provider
   - Tests for signing in with test credentials (skipped by default)
   - Tests for signing out after signing in (skipped by default)

## Skipped Tests

Some tests are skipped by default because they require a properly configured authentication environment:

- Tests that require a running Keycloak server
- Tests that require a properly configured credentials provider

## Setting Up Keycloak for Testing

To run the Keycloak tests that are skipped by default, you need to:

1. Start a Keycloak server at `http://localhost:9090`
2. Create a realm called `auth-js`
3. Create a client with:
   - Client ID: `auth-js-client`
   - Valid redirect URIs: `http://localhost:3000/*`
4. Create a test user with:
   - Username: `biyani701`
   - Password: `password`

Then you can enable the skipped tests by removing the `.skip` from the test declarations.

## Using Mocks for CI/CD

For CI/CD environments, it's recommended to use the mock implementations provided in the tests. These mocks simulate the authentication flow without requiring actual authentication servers.

To use mocks:

1. Keep the tests as they are (with `.skip` removed)
2. The tests will use the mock implementations for the authentication providers
3. This ensures that the tests can run in any environment without external dependencies

## Troubleshooting

If you encounter issues with the tests:

1. Make sure the application is running at `http://localhost:3000`
2. Check that the authentication providers are properly configured in `auth.ts`
3. Verify that the test credentials match the ones expected by the tests
4. For Keycloak tests, ensure the Keycloak server is running and properly configured
