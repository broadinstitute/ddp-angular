import { expect, Locator, Page } from '@playwright/test';
import { LmsPage } from 'pages/lms/lms-page';
import { HomePageInterface } from 'pages/page-interface';

/**
 * Landing page, unauthenticated.
 */
export default class HomePage extends LmsPage implements HomePageInterface {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await expect(this.getLogInButton()).toBeVisible();
    await expect(this.getJoinCountMeInButton()).toBeVisible();
  }

  getLogInButton(): Locator {
    return this.page.locator('.header button[data-ddp-test="signInButton"]:has-text("Log In")');
  }

  getJoinCountMeInButton(): Locator {
    return this.page.locator('.header a.cmiBtn');
  }

  async join(opts: { waitForNav?: boolean } = {}): Promise<void> {
    const { waitForNav = true } = opts;
    await this.clickAndWaitForNav(this.getJoinCountMeInButton(), { waitForNav });
  }

  logIn(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
