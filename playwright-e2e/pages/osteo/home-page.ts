import { expect, Locator, Page } from '@playwright/test';
import { AngioPageBase } from 'pages/angio/angio-page-base';
import { waitForNoSpinner } from 'utils/test-utils';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import { OsteoPageBase } from './osteo-base-page';

export default class HomePage extends OsteoPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.no-margin');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText('Together, the osteosarcoma community has the power to move research forward');
    await waitForNoSpinner(this.page);
  }

  async clickCountMeIn(): Promise<void> {
    await this.page.getByRole('banner').getByRole('link', { name: 'Count Me In' }).click();
  }
}
