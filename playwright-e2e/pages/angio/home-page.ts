import { AngioPageBase } from 'pages/angio/angio-page-base';
import { HomePageInterface } from 'pages/page-interface';
import { Locator, Page } from '@playwright/test';
import * as auth from 'authentication/auth-angio';

export default class HomePage extends AngioPageBase implements HomePageInterface {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.page.waitForFunction(() => document.title === 'Angiosarcoma Project');
  }

  /**
   * Log into Angio application
   * @param opts
   */
  async logIn(opts: { email?: string; password?: string } = {}): Promise<void> {
    await auth.login(this.page);
  }

  /**
   * Returns "count me in" button locator
   */
  getCountMeInButton(): Locator {
    return this.page.locator('span.CountButton', { hasText: 'count me in' });
  }

  /**
   * Click "count me in" button.
   * @param opts
   */
  async countMeIn(opts: { waitForNav?: boolean } = {}): Promise<void> {
    const { waitForNav = true } = opts;
    await this.clickAndWaitForNav(this.getCountMeInButton(), { waitForNav });
  }
}
