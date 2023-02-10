import { expect, Locator, Page } from '@playwright/test';
import { waitForNoSpinner } from 'utils/test-utils';
import { OsteoPageBase } from './osteo-base-page';

export default class ConsentAddendumPage extends OsteoPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.activity-header');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText('Consent Form Addendum');
    await waitForNoSpinner(this.page);
  }
}
