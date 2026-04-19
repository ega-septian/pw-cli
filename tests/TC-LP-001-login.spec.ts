import { test, expect } from './fixtures/saucedemo-fixtures';
import { SauceDemoInventoryPage } from './pages/saucedemo-inventory.page';
import { SauceDemoLoginPage } from './pages/saucedemo-login.page';

test.describe('TC-LP-001 — Verify login with valid credentials', { tag: '@TC-LP-001' }, () => {
  test('Standard User reaches product catalog after valid login', async ({
    page,
    sauceDemoUsername,
    sauceDemoPassword,
  }) => {
    const loginPage = new SauceDemoLoginPage(page);

    await test.step('Step 1: Open the login page', async () => {
      await loginPage.goto();
      await expect(page).toHaveURL('/');
    });

    await test.step('Step 2: Enter valid username and password', async () => {
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await loginPage.fillCredentials(sauceDemoUsername, sauceDemoPassword);
    });

    const catalog = await test.step('Step 3: Click Login', async (): Promise<SauceDemoInventoryPage> => {
      await expect(loginPage.loginButton).toBeVisible();
      return loginPage.submitLogin();
    });

    await test.step('Expected: User is logged in and on the product catalog', async () => {
      await expect(page).toHaveURL(/\/inventory\.html$/);

      await expect(catalog.openMenuButton).toBeVisible();
      await expect(catalog.swagLabsTitle).toBeVisible();
      await expect(catalog.productsTitle).toBeVisible();

      await expect(catalog.sortCombobox).toBeVisible();
      await expect(catalog.sortCombobox).toHaveValue('az');

      await expect(catalog.firstProductLink).toBeVisible();
      await expect(catalog.firstAddToCartButton).toBeVisible();

      await expect(catalog.footerLegal).toBeVisible();
    });
  });
});
