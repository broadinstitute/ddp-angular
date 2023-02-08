import { expect, Locator, Page } from '@playwright/test';
import { AngioPageBase } from 'pages/angio/angio-page-base';
import { waitForNoSpinner } from 'utils/test-utils';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import { OsteoPageBase } from './osteo-base-page';

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
