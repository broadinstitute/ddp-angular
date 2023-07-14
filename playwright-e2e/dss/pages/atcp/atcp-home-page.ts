import { expect, Locator, Page } from '@playwright/test';
import * as auth from 'authentication/auth-atcp';
import AtcpJoinUsPage from 'dss/pages/atcp/atcp-join-us-page';
import { AtcpPageBase } from 'dss/pages/atcp/atcp-page-base';
import { HomePageInterface } from 'dss/pages/page-interface';

export default class AtcpHomePage extends AtcpPageBase implements HomePageInterface {
  readonly joinUsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.joinUsButton = this.page.locator('a#join-us-nav');
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.joinUsButton).toBeVisible();
  }

  async logIn(): Promise<void> {
    await auth.login(this.page);
  }

  async joinUs(): Promise<AtcpJoinUsPage> {
    await Promise.all([
      this.page.waitForURL(/\/join-us/),
      this.joinUsButton.click()
    ]);
    const joinUsPage = new AtcpJoinUsPage(this.page);
    await joinUsPage.waitForReady();
    return joinUsPage;
  }
}
