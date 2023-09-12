import {MBCPageBase} from './mbc-page-base';
import {expect, Locator, Page} from '@playwright/test';
import {waitForNoSpinner} from 'utils/test-utils';
import * as auth from 'authentication/auth-lms';

export class MBCHomePage extends MBCPageBase {
  countMeInButton: Locator;
  learnMoreButton: Locator;

  constructor(page: Page) {
    super(page);
    this.countMeInButton = this.page.locator('//span[text()=\'count me \' and @class="CountButton"]');
    this.learnMoreButton = this.page.locator('//span[text()[normalize-space()=\'Learn More\']]');
  }

  async waitForReady(): Promise<void> {
    await expect(this.page).toHaveTitle('The Metastatic Breast Cancer Project');
    await expect(this.countMeInButton.first()).toBeVisible();
    await expect(this.learnMoreButton).toBeVisible();
    await expect(this.getLogInButton()).toBeVisible();
    await waitForNoSpinner(this.page);
  }

  async countMeIn(): Promise<void> {
    await this.countMeInButton.first().click();
    await waitForNoSpinner(this.page);
  }

  async learnMore(): Promise<void> {
    await this.learnMoreButton.click();
    await waitForNoSpinner(this.page);
  }

  async logIn(): Promise<void> {
    await auth.login(this.page);
  }

  override getLogInButton(): Locator {
    return this.page.locator('.Header-nav button[data-ddp-test="signInButton"]:has-text("Sign In")');
  }
}
