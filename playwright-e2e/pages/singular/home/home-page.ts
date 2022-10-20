import { expect, Locator, Page } from '@playwright/test';
import { SingularPage } from 'pages/singular/singular-page';
import { fillEmailPassword } from 'authentication/auth-singular';
import { HomePageInterface } from 'pages/page-interface';

/**
 * Landing page, unauthenticated.
 */
export default class HomePage extends SingularPage implements HomePageInterface {
  private readonly logo: Locator;
  private readonly title: Locator;
  private readonly description: Locator;

  constructor(page: Page) {
    super(page);
    this.title = this.page.locator('h1.header-title');
    this.logo = this.page.locator('a.header__logo img');
    this.description = this.page.locator('.header-description');
  }

  async waitForReady(): Promise<void> {
    // Add additional waits here
    await this.page.waitForFunction(() => document.title === 'Project Singular');
    await expect(this.title).toContainText('Discoveries in single ventricle heart defects are on the horizon.');
  }

  /**
   * Returns "Log In" button locator
   */
  getLogInButton(): Locator {
    return this.page.locator('.header button[data-ddp-test="signInButton"]:has-text("Log In")');
  }

  /**
   * Returns "Sign me up!" button locator
   */
  getSignMeUpButton(): Locator {
    return this.page.locator('header').locator('button', { hasText: 'Sign me up!' });
  }

  /**
   * Click "Sign me up!" button.
   * @param opts
   */
  async signUp(opts: { waitForNav?: boolean } = {}): Promise<void> {
    const { waitForNav = true } = opts;
    await this.clickAndWaitForNav(this.getSignMeUpButton(), { waitForNav });
  }

  /**
   * Log into Singular application
   * @param opts
   */
  async logIn(
    opts: { email?: string | undefined; password?: string | undefined; waitForNavigation?: boolean } = {}
  ): Promise<void> {
    const {
      email = process.env.singularUserEmail,
      password = process.env.singularUserPassword,
      waitForNavigation
    } = opts;
    await this.getLogInButton().click();
    await this.waitForNavAfter(async () => fillEmailPassword(this.page, { email, password, waitForNavigation }));
  }
}
