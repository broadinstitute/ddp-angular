import { expect, Locator, Page } from '@playwright/test';
import RadiobuttonGroup from 'lib/widget/radiobutton-group';
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
    await expect(this.pageTitle).toHaveText('Consent Form Addendum');
    await waitForNoSpinner(this.page);
  }

  /**
   * Question: You can share with me any available results from the sequencing of tumor sample[s] that the study has received
   * @returns {RadiobuttonGroup}
   */
  agreeToShareAvailableResults(): RadiobuttonGroup {
    return new RadiobuttonGroup(this.page, {
      ddpTestID: 'answer:SOMATIC_CONSENT_TUMOR'
    });
  }
}
