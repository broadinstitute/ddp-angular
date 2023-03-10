import { expect, Locator, Page } from '@playwright/test';
import { waitForNoSpinner } from 'utils/test-utils';
import { OsteoPageBase } from 'pages/osteo/osteo-page-base';

export default class AboutYourOsteosarcoma extends OsteoPageBase {
  private readonly pageTitle: Locator;
  private readonly expectedTitle: string;

  constructor(page: Page, expectedTitle: string) {
    super(page);
    this.expectedTitle = expectedTitle;
    this.pageTitle = this.page.locator('h1.activity-header');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText(this.expectedTitle);
    await waitForNoSpinner(this.page);
  }
}
