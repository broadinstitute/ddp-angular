import { expect, Locator, Page } from '@playwright/test';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import { PancanPage } from '../pancan-page';
import { PatientsData, TypePatient } from './utils/PatientType';
import { generateUserName } from '../../../utils/faker-utils';
import * as user from '../../../data/fake-user.json';

export default class ConsentFormPage extends PancanPage {
  constructor(page: Page, private typePatient: TypePatient = 'adult') {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.firstName().toLocator().waitFor({ state: 'visible' });
  }

  async bloodSamples(): Promise<void> {
    const bloodSamplesRadioButton = this.page.locator(`mat-radio-button[id=mat-radio-2]`);
    await bloodSamplesRadioButton.click();
  }

  async cancerSamples(): Promise<void> {
    const cancerSamplesRadioButton = this.page.locator(`mat-radio-button[id=mat-radio-5]`);
    await cancerSamplesRadioButton.click();
  }

  /**
   * Your Name (Study Participant):
   */
  /**
   * <br> Question: First Name
   * <br> Type: Input
   */
  firstName(): Input {
    return new Input(this.page, { ddpTestID: PatientsData[this.typePatient].ddpTestID.firstName });
  }

  /**
   * <br> Question: Last Name
   * <br> Type: Input
   */
  lastName(): Input {
    return new Input(this.page, { ddpTestID: PatientsData[this.typePatient].ddpTestID.lastName });
  }

  /**
   * <br> Question: Your Signature (Full Name):
   * <br> Type: Input
   */
  signature(): Input {
    return new Input(this.page, { ddpTestID: PatientsData[this.typePatient].ddpTestID.signature });
  }

  /**
   * <br> Question: Your Signature (Full Name):
   * <br> Type: Input
   */
  childSignature(): Input {
    return new Input(this.page, { ddpTestID: PatientsData[this.typePatient].ddpTestID.assentChildSignature });
  }

  /**
   * <br> Question: AUTHORIZATION SIGNATURE
   * <br> Type: Input
   */
  authorizationSignature(): Input {
    return new Input(this.page, { ddpTestID: PatientsData[this.typePatient].ddpTestID.authorizationSignature });
  }

  async waitSecondReady(): Promise<void> {
    await this.childSignature().toLocator().waitFor({ state: 'visible' });
  }

  /**
   * <br> Question: Your Date of Birth
   * <br> Type: Input
   * @param month
   * @param date
   * @param year
   */
  async dateOfBirth(month: number | string, date: number | string, year: number | string): Promise<void> {
    const dob = new Question(this.page, { prompt: PatientsData[this.typePatient].ddpTestID.dateOfBirthLocation });
    await dob.date().locator('input[data-placeholder="MM"]').fill(month.toString());
    await dob.date().locator('input[data-placeholder="DD"]').fill(date.toString());
    await dob.date().locator('input[data-placeholder="YYYY"]').fill(year.toString());
  }

  async parentData() {
    const parentFirstName = new Input(this.page, { ddpTestID: PatientsData.child.ddpTestID.assentFirstName });
    const parentLastName = new Input(this.page, { ddpTestID: PatientsData.child.ddpTestID.assentLastName });
    const parentSignature = new Input(this.page, { ddpTestID: PatientsData.child.ddpTestID.assentSignature });
    const relationshipChild = new Question(this.page, {
      prompt: PatientsData.child.ddpTestID.relationshipChild || ''
    });
    const firstName = generateUserName(user.patient.firstName);
    const lastName = generateUserName(user.patient.lastName);
    await parentFirstName.fill(firstName);
    await parentLastName.fill(lastName);
    await parentSignature.fill(lastName);
    await relationshipChild.radioButton('Parent').locator('label').click();
  }
}
