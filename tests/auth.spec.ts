import { test, expect } from '@playwright/test';

// Retrieve test credentials from environment variables
// IMPORTANT: These environment variables must be set in your test execution environment.
// For local testing, you can use a .env file (ensure it's in .gitignore)
// and load it in playwright.config.ts using a library like 'dotenv'.
const TEST_USER_EMAIL = process.env.E2E_TEST_USER_EMAIL || 'testuser@example.com'; // Default for structure, real value needed for run
const TEST_USER_PASSWORD = process.env.E2E_TEST_USER_PASSWORD || 'password123'; // Default for structure, real value needed for run

// It's good practice to ensure these are set in a real test run.
// Example check (can be placed in a global setup or at the start of tests):
// if (!process.env.E2E_TEST_USER_EMAIL || !process.env.E2E_TEST_USER_PASSWORD) {
//   throw new Error('E2E_TEST_USER_EMAIL and E2E_TEST_USER_PASSWORD environment variables must be set.');
// }

const SIGN_IN_URL = '/sign-in';
const SIGN_UP_URL = '/sign-up';
const PROTECTED_URL = '/items'; // As defined in hooks.server.ts
const HOME_URL = '/';

test.describe('Authentication Flows', () => {
  // Test Case: Sign-up
  // IMPORTANT: This test is conceptual and primarily checks if the Clerk sign-up component loads.
  // A full E2E sign-up flow is often complex due to CAPTCHAs, email verification steps, etc.,
  // which Clerk might enforce. For reliable testing, it's usually better to pre-create
  // test users in your Clerk dashboard or via Clerk's management API if available for test setups.
  // Ensure CAPTCHA and email verification are appropriately handled for your test environment/users in Clerk.
  test('Sign-up page should load Clerk component', async ({ page }) => {
    await page.goto(SIGN_UP_URL);

    // Expect Clerk's sign-up form to be present.
    // The selector 'form' and the text 'Create your account' are common but may need adjustment
    // if Clerk's UI changes or if it's rendered within an iframe.
    // If Clerk uses an iframe for its components, you'll need to use page.frameLocator().
    await expect(page.locator('form')).toContainText('Create your account', { timeout: 10000 });
    // An alternative or additional check could be for a specific Clerk data-testid if available.
  });

  // Test Case: Sign-in
  // IMPORTANT: This test assumes a test user account (specified by E2E_TEST_USER_EMAIL
  // and E2E_TEST_USER_PASSWORD) has been pre-created in your Clerk application dashboard.
  // Ensure this user exists and MFA/CAPTCHA is appropriately configured for testing.
  test('User should be able to sign in', async ({ page }) => {
    await page.goto(SIGN_IN_URL);

    // Fill in Clerk's sign-in form.
    // Locators like getByLabel are generally robust.
    // If Clerk UI is in an iframe, use: const frame = page.frameLocator('iframe[name="clerk-form"]'); // Example
    // Then: await frame.getByLabel(/email address/i).fill(TEST_USER_EMAIL);
    await page.getByLabel(/email address/i).fill(TEST_USER_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_USER_PASSWORD);
    
    // Common button texts for Clerk are "Continue" or "Sign in".
    // Using a regular expression to cover both.
    await page.getByRole('button', { name: /continue|sign in/i }).click();

    // Verify successful sign-in.
    // Expect redirection to the configured afterSignInUrl (HOME_URL in this case).
    await expect(page).toHaveURL(HOME_URL, { timeout: 10000 });
    
    // Check for an element indicating a signed-in state, like the UserButton in the navigation.
    // This selector assumes UserButton's text or accessible name includes "UserButton". Adjust if needed.
    // It's also common for UserButton to be a button itself or contain one.
    // A more specific selector for UserButton might be needed, e.g., by class or data-testid.
    await expect(page.locator('nav')).toContainText('UserButton', { timeout: 10000 });
  });

  // Test Case: Sign-out
  // This test depends on a successful sign-in.
  test('User should be able to sign out', async ({ page }) => {
    // First, perform sign-in steps
    await page.goto(SIGN_IN_URL);
    await page.getByLabel(/email address/i).fill(TEST_USER_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_USER_PASSWORD);
    await page.getByRole('button', { name: /continue|sign in/i }).click();
    await page.waitForURL(HOME_URL, { timeout: 10000 }); // Wait for redirect

    // Now, sign out using UserButton.
    // The UserButton might be a button itself or a trigger for a dropdown.
    // Adjust the selector based on how UserButton is implemented or its accessible name.
    // Common names could be "User profile button", "Open user menu", etc.
    const userButton = page.getByRole('button', { name: /user profile button|open user menu|userbutton/i });
    await userButton.click();
    
    // Clerk's UserButton typically opens a dropdown menu.
    // The "Sign out" action is usually a menuitem.
    const signOutButton = page.getByRole('menuitem', { name: /sign out/i });
    await signOutButton.click();

    // Verify successful sign-out.
    // Expect redirection to the configured afterSignOutUrl (HOME_URL in this case).
    await expect(page).toHaveURL(HOME_URL, { timeout: 10000 });
    
    // Check for an element indicating a signed-out state, like the "Sign In" link.
    await expect(page.locator('nav')).toContainText('Sign In', { timeout: 10000 });
  });
});

test.describe('Route Protection', () => {
  test('Unauthenticated user should be redirected from protected route', async ({ page }) => {
    // Playwright contexts start unauthenticated by default.
    await page.goto(PROTECTED_URL);
    
    // Expect redirection to the sign-in page.
    // Using a RegExp to make the check flexible if there are query params.
    await expect(page).toHaveURL(new RegExp(SIGN_IN_URL), { timeout: 10000 });
  });

  test('Authenticated user should access protected route', async ({ page }) => {
    // First, perform sign-in steps
    await page.goto(SIGN_IN_URL);
    await page.getByLabel(/email address/i).fill(TEST_USER_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_USER_PASSWORD);
    await page.getByRole('button', { name: /continue|sign in/i }).click();
    await page.waitForURL(HOME_URL, { timeout: 10000 }); // Wait for redirect

    // Navigate to the protected route
    await page.goto(PROTECTED_URL);
    
    // Expect to be on the protected route and not redirected.
    await expect(page).toHaveURL(PROTECTED_URL, { timeout: 10000 });
    
    // Optionally, check for specific content on the protected page.
    // For example, if the items page has a specific heading:
    // await expect(page.locator('h1')).toContainText('Items', { timeout: 10000 });
  });

  test('Non-protected route should be accessible to unauthenticated user', async ({ page }) => {
    await page.goto(HOME_URL);
    await expect(page).toHaveURL(HOME_URL);
    
    // Optionally, check for specific content on the home page.
    // For example, the app name in the header:
    await expect(page.locator('header nav a[href="/"]')).toContainText('SvelteKit Items App', { timeout: 10000 });
  });
});
