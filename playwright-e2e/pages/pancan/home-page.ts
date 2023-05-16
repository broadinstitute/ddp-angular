import { expect, Locator, Page } from '@playwright/test';
import Modal from 'lib/component/modal';
import { PancanPageBase } from 'pages/pancan/pancan-page-base';
import { HomePageInterface } from 'pages/page-interface';
import * as auth from 'authentication/auth-pancan';

export default class HomePage extends PancanPageBase implements HomePageInterface {
  readonly joinMailingListButton: Locator;
  readonly loginButton: Locator;
  readonly joinCountMeInButton: Locator;

  constructor(page: Page) {
    super(page);
    this.joinMailingListButton = this.page.getByRole('button', { name: 'Join Mailing List' });
    this.loginButton = this.page.locator('.header .controls button[data-ddp-test="signInButton"]:has-text("Log In")');
    this.joinCountMeInButton = this.page.locator('.info a', { hasText: 'Join Count Me In' });
  }

  async waitForReady(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
    await expect(this.joinCountMeInButton).toBeVisible();
  }

  async join(opts: { waitForNav?: boolean } = {}): Promise<void> {
    const { waitForNav = true } = opts;
    await this.clickAndWaitForNav(this.joinCountMeInButton, { waitForNav });
  }

  async logIn(): Promise<void> {
    await auth.login(this.page);
  }

  async fillInStayInformedModal(firstName: string, lastName: string, email: string): Promise<void> {
    await this.joinMailingListButton.click();

    const modal = new Modal(this.page);
    await modal.getInput({ label: 'First Name'}).fill(firstName);
    await modal.getInput({ label: 'Last Name'}).fill(lastName);
    await modal.getInput({ label: 'Email Address'}).fill(email);
    await modal.getInput({ label: 'Email Confirmation (Reenter Email)'}).fill(email);

    const [response] = await Promise.all([
      this.page.waitForResponse(response => response.url().includes('/v1/mailing-list')
        && response.request().method() === 'POST'
        && response.status() === 204, { timeout: 50 * 1000 }),
      this.page.getByRole('button', { name: 'JOIN' }).click()
    ]);
  }
}
