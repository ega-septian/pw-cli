import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      testIgnore: ['**/suites/**', '**/TC-LP-*.spec.ts'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'swag-labs-chromium',
      testDir: './tests',
      testMatch: ['**/suites/**/*.spec.ts', '**/TC-LP-*.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
      },
    },
  ],
});
