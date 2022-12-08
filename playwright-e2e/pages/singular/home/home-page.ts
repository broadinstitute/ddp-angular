import { expect, Locator, Page } from '@playwright/test';
import { SingularPage } from 'pages/singular/singular-page';
import * as auth from 'authentication/auth-singular';
import { HomePageInterface } from 'pages/page-interface';
import { waitForNoSpinner } from 'utils/test-utils';

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
    await this.page.waitForFunction(() => document.title === 'Project Singular');
    await expect(this.title).toContainText('Discoveries in single ventricle heart defects are on the horizon.');
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
    await waitForNoSpinner(this.page);
  }

  /**
   * Log into Singular application
   * @param opts
   */
  async logIn(opts: { email?: string; password?: string; waitForNavigation?: boolean } = {}): Promise<void> {
    await auth.login(this.page);
  }
}
