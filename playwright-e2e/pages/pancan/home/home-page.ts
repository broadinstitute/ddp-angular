import { expect, Locator, Page } from '@playwright/test';
import { PancanPage } from 'pages/pancan/pancan-page';
import { HomePageInterface } from 'pages/page-interface';
import * as auth from 'authentication/auth-pancan';

export default class HomePage extends PancanPage implements HomePageInterface {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await expect(this.getLogInButton()).toBeVisible();
    await expect(this.getJoinCountMeInButton()).toBeVisible();
  }

  getLogInButton(): Locator {
    return this.page.locator('.header .controls button[data-ddp-test="signInButton"]:has-text("Log In")');
  }

  /**
   * Returns "Join Count Me In" button
   */
  getJoinCountMeInButton(): Locator {
    return this.page.locator('.info a', { hasText: 'Join Count Me In' });
  }

  async join(opts: { waitForNav?: boolean } = {}): Promise<void> {
    const { waitForNav = true } = opts;
    await this.clickAndWaitForNav(this.getJoinCountMeInButton(), { waitForNav });
  }

  async logIn(): Promise<void> {
    await auth.login(this.page);
  }
}
