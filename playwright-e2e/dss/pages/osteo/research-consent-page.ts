import { expect, Locator, Page } from '@playwright/test';
import Question from 'dss/component/Question';
import { PatientsData, TypePatient } from 'dss/pages/patient-type';
import { waitForNoSpinner } from 'utils/test-utils';
import { OsteoPageBase } from 'dss/pages/osteo/osteo-page-base';

export default class ResearchConsentFormPage extends OsteoPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page, private typePatient: TypePatient = 'adult') {
    super(page);
    this.pageTitle = this.page.locator('h1.activity-header');
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.pageTitle).toHaveText('Research Consent Form');
  }

  async agreeToDrawBloodSamples(answer = 'Yes'): Promise<void> {
    const question = new Question(this.page, { cssClassAttribute: `.${PatientsData[this.typePatient].ddpTestID.bloodSamples}` });
    await question.check(answer);
  }

  async requestStoredSamples(answer = 'Yes'): Promise<void> {
    const question = new Question(this.page, {
      cssClassAttribute: `.${PatientsData[this.typePatient].ddpTestID.assentTissue}`
    });
    await question.check(answer);
  }
}
