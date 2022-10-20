import { expect, Locator, Page } from '@playwright/test';
import { PancanPage } from 'pages/pancan/pancan-page';
import { HomePageInterface } from 'pages/page-interface';

export default class HomePage extends PancanPage implements HomePageInterface {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    // Add additional waits here
    await expect(this.getLogInButton()).toBeVisible();
    await expect(this.getJoinCountMeInButton()).toBeVisible();
  }

  getLogInButton(): Locator {
    return this.page.locator('.header button[data-ddp-test="signInButton"]:has-text("Log In")');
  }

  /**
   * Returns "Join Count Me In" button
   */
  getJoinCountMeInButton(): Locator {
    return this.page.locator('a', { hasText: 'Join Count Me In' });
  }

  async join(opts: { waitForNav?: boolean } = {}): Promise<void> {
    const { waitForNav = true } = opts;
    await this.clickAndWaitForNav(this.getJoinCountMeInButton(), { waitForNav });
  }

  logIn(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
