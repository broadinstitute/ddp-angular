import { expect, Locator, Page } from '@playwright/test';

export default class HomePage {
  private readonly page: Page;
  private readonly loginButton: Locator;
  private readonly pageLogo: Locator;
  private readonly headerTitle: Locator;
  private readonly headerDescription: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.locator('.header button[data-ddp-test="signInButton"]:has-text("Log In")');
    this.headerTitle = page.locator('h1.header-title');
    this.pageLogo = page.locator('a.header__logo img');
    this.headerDescription = page.locator('.header-description');
  }

  async waitForReady() {
    await expect(this.headerTitleLocator).toBeVisible();
    // Add additional checks here
  }

  get loginButtonLocator(): Locator {
    return this.loginButton;
  }

  get headerTitleLocator(): Locator {
    return this.headerTitle;
  }

  get headerDescriptionLocator(): Locator {
    return this.headerDescription;
  }

  get pageLogoLocator(): Locator {
    return this.pageLogo;
  }
}
