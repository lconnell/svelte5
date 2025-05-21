import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Directory where tests will be located
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html', // Generates an HTML report
  use: {
    baseURL: 'http://localhost:5173', // Default SvelteKit dev server URL
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // You can add more browsers like firefox, webkit if needed
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  webServer: {
    command: 'npm run dev', // Command to start the dev server
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // Increase timeout for webServer
  },
});
