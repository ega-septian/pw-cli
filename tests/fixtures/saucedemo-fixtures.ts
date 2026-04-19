import { test as base, expect } from '@playwright/test';

export interface SauceDemoOptions {
  sauceDemoUsername: string;
  sauceDemoPassword: string;
}

export interface SauceDemoFixtures extends SauceDemoOptions {
  sauceDemoSessionCleanup: void;
}

export const test = base.extend<SauceDemoFixtures>({
  sauceDemoUsername: ['standard_user', { option: true }],
  sauceDemoPassword: ['secret_sauce', { option: true }],

  sauceDemoSessionCleanup: [
    async ({ page }, use) => {
      await use();
      await page.context().clearCookies();
      await page.evaluate(() => {
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch {
          /* non-http pages */
        }
      });
    },
    { auto: true },
  ],
});

export { expect };
