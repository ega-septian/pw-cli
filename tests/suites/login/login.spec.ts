import { test, expect } from '../../fixtures/base.fixture';
import { InventoryPage } from '../../pages/inventory.page';
import { LoginPage } from '../../pages/login.page';

/**
 * Login area — one file, many scenarios. Put **tags on each `test()`** (e.g. @TC-LP-001)
 * so you can run `npx playwright test --grep @TC-LP-001`. Optional: add `@suite-login`
 * on `test.describe` if you also want `--grep @suite-login` for all login TCs at once.
 */
test.describe('Login suite', () => {
  test('Standard User reaches product catalog after valid login', { tag: '@TC-LP-001' }, async ({
    page,
    swagLabsUsername,
    swagLabsPassword,
  }) => {
    const loginPage = new LoginPage(page);

    await test.step('Step 1: Open the login page', async () => {
      await loginPage.goto();
      await expect(page).toHaveURL('/');
    });

    await test.step('Step 2: Enter valid username and password', async () => {
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await loginPage.fillCredentials(swagLabsUsername, swagLabsPassword);
    });

    const catalog = await test.step('Step 3: Click Login', async (): Promise<InventoryPage> => {
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
