import { expect, Locator, Page } from '@playwright/test';

/**
 * Landing page, unauthenticated.
 */
export default class HomePage {
  private readonly page: Page;
  readonly loginButton: Locator;
  readonly pageLogo: Locator;
  readonly title: Locator;
  readonly description: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.locator('.header button[data-ddp-test="signInButton"]:has-text("Log In")');
    this.title = page.locator('h1.header-title');
    this.pageLogo = page.locator('a.header__logo img');
    this.description = page.locator('.header-description');
  }

  async waitForReady() {
    await expect(this.title).toBeVisible();
    // Add additional checks here
  }
}
