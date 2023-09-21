import { expect, Locator, Page } from '@playwright/test';
import Question from 'dss/component/Question';
import { LmsPageBase } from 'dss/pages/lms/lms-page-base';
import { LmsPatientsData as PatientsData, TypePatient } from 'dss/pages/lms/lms-patient-type';
import { waitForNoSpinner } from 'utils/test-utils';

export default class LmsResearchConsentPage extends LmsPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page, private typePatient: TypePatient = 'adult') {
    super(page);
    this.pageTitle = this.page.locator('h1.activity-header');
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.pageTitle).toHaveText('Research Consent Form');
    await waitForNoSpinner(this.page);
  }

  get agreeToDrawBloodQuestion(): Question {
    return new Question(this.page, { cssClassAttribute: `.${PatientsData[this.typePatient].testId.bloodSamples}` });
  }

  get canRequestStoredTumorSamples(): Question {
    return new Question(this.page, { cssClassAttribute: `.${PatientsData[this.typePatient].testId.assentTissue}` });
  }

  async agreeToDrawBloodSamples(answer = 'Yes'): Promise<void> {
    await this.agreeToDrawBloodQuestion.check(answer);
  }

  async requestStoredSamples(answer = 'Yes'): Promise<void> {
    await this.canRequestStoredTumorSamples.check(answer);
  }

  async fillInChildFullName(firstName: string, lastName: string): Promise<void> {
    await super.fillInName(firstName, lastName,
      {
        firstNameTestId: PatientsData[this.typePatient].testId.firstName!,
        lastNameTestId: PatientsData[this.typePatient].testId.lastName!
      });
  }

  async fillInYourFullName(firstName: string, lastName: string): Promise<void> {
    await super.fillInName(firstName, lastName,
      {
        firstNameTestId: PatientsData[this.typePatient].testId.assentFirstName!,
        lastNameTestId: PatientsData[this.typePatient].testId.assentLastName!
      });
  }

  async fillInSignature(fullName: string): Promise<void> {
    await super.signature({ testId: PatientsData[this.typePatient].testId.assentSignature! }).fill(fullName);
  }

  async selectRelationshipToChild(relationship: string): Promise<void> {
    await new Question(this.page, { prompt: PatientsData[this.typePatient].testId.relationshipChild }).toRadiobutton().check(relationship);
  }

  async fillInChildSignature(fullName: string): Promise<void> {
    await super.signature({ testId: PatientsData[this.typePatient].testId.assentChildSignature! }).fill(fullName);
  }
}
