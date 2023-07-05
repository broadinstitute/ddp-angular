import { expect, Locator, Page } from '@playwright/test';
import * as auth from 'authentication/auth-lms';
import { LmsPageBase } from 'dss/pages/lms/lms-page-base';
import { waitForNoSpinner } from 'utils/test-utils';

export default class LmsHomePage extends LmsPageBase {
  countMeInButton: Locator;
  learnMoreButton: Locator;

  constructor(page: Page) {
    super(page);
    this.countMeInButton = this.page.getByRole('link', { name: 'Count Me In' });
    this.learnMoreButton = this.page.getByRole('button', { name: 'Learn More', exact: true });
  }

  async waitForReady(): Promise<void> {
    await expect(this.page).toHaveTitle('Leiomyosarcoma Project');
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
}
