import { expect, Locator, Page } from '@playwright/test';
import Question from 'dss/component/Question';
import { LmsPageBase } from 'dss/pages/lms/lms-page-base';
import { PatientsData, TypePatient } from 'dss/pages/patient-type';

export default class ResearchConsentPage extends LmsPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page, private typePatient: TypePatient = 'adult') {
    super(page);
    this.pageTitle = this.page.locator('h1.activity-header');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Research Consent Form');
    await super.waitForReady();
  }

  get agreeToDrawBloodQuestion(): Question {
    return new Question(this.page, { cssClassAttribute: `.${PatientsData[this.typePatient].ddpTestID.bloodSamples}` });
  }

  get canRequestStoredTumorSamples(): Question {
    return new Question(this.page, { cssClassAttribute: `.${PatientsData[this.typePatient].ddpTestID.assentTissue}` });
  }

  async agreeToDrawBloodSamples(answer = 'Yes'): Promise<void> {
    await this.agreeToDrawBloodQuestion.check(answer);
  }

  async requestStoredSamples(answer = 'Yes'): Promise<void> {
    await this.canRequestStoredTumorSamples.check(answer);
  }
}
