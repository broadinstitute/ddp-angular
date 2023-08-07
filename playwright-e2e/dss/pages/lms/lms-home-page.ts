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
    await waitForNoSpinner(this.page);
    await Promise.all([
      expect(this.page).toHaveTitle('Leiomyosarcoma Project'),
      expect(this.countMeInButton.first()).toBeVisible(),
      expect(this.learnMoreButton).toBeVisible(),
      expect(this.getLogInButton()).toBeVisible()
    ])
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
