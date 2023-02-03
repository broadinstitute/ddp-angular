import { expect, Locator, Page } from '@playwright/test';
import { AngioPageBase } from 'pages/angio/angio-page-base';
import { waitForNoSpinner } from 'utils/test-utils';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import { OsteoPageBase } from './osteo-base-page';

export default class ConsentAddendumPage extends OsteoPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.activity-header');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ visible: true });
    await expect(this.pageTitle).toHaveText('Consent Form Addendum');
    await waitForNoSpinner(this.page);
  }
}