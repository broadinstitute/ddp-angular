import { expect, Locator, Page } from '@playwright/test';
import { LmsPageBase } from 'dss/pages/lms/lms-page-base';
import { waitForNoSpinner } from 'utils/test-utils';

export default class MedicalReleasePage extends LmsPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.activity-header');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Medical Release Form');
    await waitForNoSpinner(this.page);
  }
}
