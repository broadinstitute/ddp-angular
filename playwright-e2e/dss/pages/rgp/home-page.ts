import { Locator, Page } from '@playwright/test';
import * as auth from 'authentication/auth-rgp';
import { HomePageInterface } from 'dss/pages/page-interface';
import { RgpPageBase } from 'dss/pages/rgp/rgp-page-base';

/**
 * Landing page, unauthenticated.
 */
export default class HomePage extends RgpPageBase implements HomePageInterface {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.page.waitForFunction(() => document.title === 'Rare Genomes Project');
  }

  /**
   * Returns "Get Started" button locator
   */
  getStartedButton(): Locator {
    return this.page.locator('a', { hasText: 'Get Started' });
  }

  /**
   * Click "Get Started" button.
   * @param opts
   */
  async clickGetStarted(opts: { waitForNav?: boolean } = {}): Promise<void> {
    const { waitForNav = true } = opts;
    await this.clickAndWaitForNav(this.getStartedButton(), { waitForNav });
  }

  /**
   * Returns the Sign In button
   */
  getSignInButton(): Locator {
    return this.page.locator("//div[contains(@class, 'get-started-auth')]//button[contains(text(), 'Sign In')]");
  }

  async clickSignIn(): Promise<void> {
    const button = this.getSignInButton();
    await button.click();
  }

  /**
   * Log into RGP application
   * @param opts
   */
  async logIn(opts: { email?: string; password?: string } = {}): Promise<void> {
    await auth.login(this.page);
  }
}
