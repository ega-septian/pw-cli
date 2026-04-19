import { type Locator, type Page } from '@playwright/test';
import { SauceDemoInventoryPage } from './saucedemo-inventory.page';

/** Sauce Demo login page (/) — actions only; assertions stay in specs. */
export class SauceDemoLoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async fillCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  /** Clicks Login and yields the catalog page object (navigation). */
  async submitLogin(): Promise<SauceDemoInventoryPage> {
    await this.loginButton.click();
    await this.page.waitForURL(/\/inventory\.html$/);
    return new SauceDemoInventoryPage(this.page);
  }
}
