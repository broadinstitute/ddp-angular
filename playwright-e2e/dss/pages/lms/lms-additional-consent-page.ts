import { expect, Locator, Page } from '@playwright/test';
import Question from 'dss/component/Question';
import Radiobutton from 'dss/component/radiobutton';
import { LmsPageBase } from 'dss/pages/lms/lms-page-base';
import { LmsPatientsData as PatientsData, TypePatient } from 'dss/pages/lms/lms-patient-type';

export default class LmsAdditionalConsentPage extends LmsPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page, private typePatient: TypePatient = 'adult') {
    super(page);
    this.pageTitle = this.page.locator('h1.activity-header');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toHaveText(PatientsData[this.typePatient].additionalConsentForm);
    await super.waitForReady();
  }

  /**
   * Question: You can share with me any available results from the sequencing of tumor sample[s] that the study has received.
   * @returns {Radiobutton}
   */
  async agreeToShareWithMeResults(answer = 'Yes'): Promise<void> {
    await new Radiobutton(this.page, { ddpTestID: PatientsData[this.typePatient].testId.agreeToShareWithMeResults }).check(answer);
  }

  agreeToShareWithParentGuardian(): Question {
    return new Question(this.page, { cssClassAttribute: '.boolean-answer-SOMATIC_ASSENT_ADDENDUM'});
  }
}
