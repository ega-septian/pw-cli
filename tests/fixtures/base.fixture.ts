import { test as base, expect } from '@playwright/test';

/**
 * Extended `test` / fixtures for Swag Labs demo (fixtures-and-hooks.md).
 * `baseURL`: playwright.config project `swag-labs-chromium`.
 */
export interface SwagLabsOptions {
  swagLabsUsername: string;
  swagLabsPassword: string;
}

export interface SwagLabsFixtures extends SwagLabsOptions {
  /** Clears cookies and web storage after each test. */
  swagLabsSessionCleanup: void;
}

export const test = base.extend<SwagLabsFixtures>({
  swagLabsUsername: ['standard_user', { option: true }],
  swagLabsPassword: ['secret_sauce', { option: true }],

  swagLabsSessionCleanup: [
    async ({ page }, use) => {
      await use();
      await page.context().clearCookies();
      await page.evaluate(() => {
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch {
          /* ignore */
        }
      });
    },
    { auto: true },
  ],
});

export { expect };
