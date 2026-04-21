import { type Locator, type Page } from '@playwright/test';

/** Product catalog (inventory.html) after login. */
export class InventoryPage {
  readonly openMenuButton: Locator;
  readonly swagLabsTitle: Locator;
  readonly productsTitle: Locator;
  readonly sortCombobox: Locator;
  readonly firstProductLink: Locator;
  readonly firstAddToCartButton: Locator;
  readonly footerLegal: Locator;

  constructor(private readonly page: Page) {
    this.openMenuButton = page.getByRole('button', { name: 'Open Menu' });
    this.swagLabsTitle = page.getByText('Swag Labs');
    this.productsTitle = page.getByText('Products', { exact: true });
    this.sortCombobox = page.getByRole('combobox');
    this.firstProductLink = page.getByRole('link', { name: 'Sauce Labs Backpack' }).first();
    this.firstAddToCartButton = page.getByRole('button', { name: 'Add to cart' }).first();
    this.footerLegal = page.getByText(
      '© 2026 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy',
    );
  }
}
