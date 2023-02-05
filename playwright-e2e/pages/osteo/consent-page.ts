import { expect, Locator, Page } from '@playwright/test';
import { AngioPageBase } from 'pages/angio/angio-page-base';
import { booleanToYesOrNo, waitForNoSpinner } from 'utils/test-utils';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import { OsteoPageBase } from './osteo-base-page';

export default class ResearchConsentPage extends OsteoPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.PageHeader-title');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ visible: true });
    await expect(this.pageTitle).toHaveText('Research Consent Form');
    await waitForNoSpinner(this.page);
  }
}
