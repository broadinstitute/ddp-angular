import { expect, Locator, Page } from '@playwright/test';
import Radiobutton from 'dss/component/radiobutton';
import { LmsPageBase } from 'dss/pages/lms/lms-page-base';
import { TypePatient } from 'dss/pages/patient-type';

export default class AdditionalConsentPage extends LmsPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page, private typePatient: TypePatient = 'adult') {
    super(page);
    this.pageTitle = this.page.locator('h1.activity-header');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Additional Consent Form:\\nLearning About Your Tumor');
    await super.waitForReady();
  }

  /**
   * Question: You can share with me any available results from the sequencing of tumor sample[s] that the study has received.
   * @returns {Radiobutton}
   */
  agreeToShareResults(): Radiobutton {
    return new Radiobutton(this.page, { ddpTestID: 'answer:SOMATIC_CONSENT_ADDENDUM_TUMOR' });
  }
}
