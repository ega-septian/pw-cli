import { type Locator, type Page } from '@playwright/test';
import { InventoryPage } from './inventory.page';

/** Login page (/) — actions only; assertions stay in specs. */
export class LoginPage {
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

  async submitLogin(): Promise<InventoryPage> {
    await this.loginButton.click();
    await this.page.waitForURL(/\/inventory\.html$/);
    return new InventoryPage(this.page);
  }
}
