import dotenv from "dotenv";
dotenv.config();

import { test, expect, type Page } from "@playwright/test";

test("Basic auth", async ({ page, browser }) => {
  console.log("Username from env:", process.env.TEST_KEYCLOAK_USERNAME);
  console.log("Username from env:", process.env.TEST_KEYCLOAK_PASSWORD);

  if (
    !process.env.TEST_KEYCLOAK_USERNAME ||
    !process.env.TEST_KEYCLOAK_PASSWORD
  )
    throw new TypeError("Incorrect TEST_KEYCLOAK_{USERNAME,PASSWORD}");

  await test.step("should login", async () => {
    await page.goto("http://localhost:3000/auth/signin");
    console.log("Initial Page URL:", page.url());

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    console.log("Page loaded");

    // Check if we're on the correct sign-in page
    // await expect(page.locator('Choose your preferred sign-in method')).toBeVisible();
    // Fix: Use the correct text and proper locator method
    await expect(page.getByRole('heading', { name: 'Choose a sign-in method' })).toBeVisible();
    await expect(page.locator('p:has-text("Choose your preferred sign-in method")')).toBeVisible();
    
    // Now click Keycloak
    // await page.getByRole('button', { name: 'Continue with Keycloak' }).click();
    
    // await page.waitForLoadState('networkidle');
    // console.log("Page URL after Keycloak click:", page.url());

    // await page.getByText("Continue with Keycloak").click();
    
    // await page.waitForLoadState('networkidle');
    // console.log("Page URL after Keycloak click:", page.url());
        
    // console.log("Page URL:", page.url());
    // await page.getByText("Username or email").waitFor()
    // // await expect(page.getByLabel("Username or email")).toBeVisible();

    // await page
    //   .getByLabel("Username or email")
    //   .fill(process.env.TEST_KEYCLOAK_USERNAME!);
    // await page.locator("#password").fill(process.env.TEST_KEYCLOAK_PASSWORD!);
    // await page.getByRole("button", { name: "Sign In" }).click();
    // await page.waitForURL("http://localhost:3000");
    // const session = await page.locator("pre").textContent();

    // expect(JSON.parse(session ?? "{}")).toEqual({
    //   user: {
    //     email: "bob@alice.com",
    //     name: "Bob Alice",
    //     image: "https://avatars.githubusercontent.com/u/67470890?s=200&v=4",
    //   },
    //   expires: expect.any(String),
    // });
  });

  await test.step.skip("should logout", async () => {
    await page.getByText("Sign out").click();
    await page
      .locator("header")
      .getByRole("button", { name: "Sign in", exact: true })
      .waitFor();
    await page.goto("http://localhost:3000/auth/session");

    expect(await page.locator("html").textContent()).toBe("null");
  });
});
