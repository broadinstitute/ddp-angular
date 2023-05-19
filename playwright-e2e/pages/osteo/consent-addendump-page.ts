import { expect, Locator, Page } from '@playwright/test';
import Radiobutton from 'lib/widget/radiobutton';
import { waitForNoSpinner } from 'utils/test-utils';
import { OsteoPageBase } from 'pages/osteo/osteo-page-base';

export default class ConsentAddendumPage extends OsteoPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.activity-header');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText('Consent Form Addendum: Learning About Your Tumor');
    await waitForNoSpinner(this.page);
  }

  /**
   * Question: You can share with me any available results from the sequencing of tumor sample[s] that the study has received
   * @returns {Radiobutton}
   */
  agreeToShareAvailableResults(): Radiobutton {
    return new Radiobutton(this.page, { ddpTestID: 'answer:SOMATIC_CONSENT_TUMOR' });
  }
}
