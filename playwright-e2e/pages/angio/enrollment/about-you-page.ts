import { expect, Locator, Page } from '@playwright/test';
import { AngioPageBase } from 'pages/angio/angio-page-base';
import { waitForNoSpinner } from 'utils/test-utils';
import { MONTH } from 'data/constants';
import Question from 'lib/component/Question';

export default class AboutYouPage extends AngioPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.PageHeader-title');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ visible: true });
    await expect(this.pageTitle).toHaveText('About you');
    await waitForNoSpinner(this.page);
  }

  /**
   * Question: When were you first diagnosed with angiosarcoma?
   * Type: Select
   *
   * @param month
   * @param year
   *
   */
  async whenDiagnosedWithAngiosarcoma(month: MONTH, year: string): Promise<void> {
    const question = new Question(this.page, { prompt: 'When were you first diagnosed with angiosarcoma?' });
    await question.select('month').selectOption({ label: month });
    await question.select('year').selectOption({ label: year });
  }
}
