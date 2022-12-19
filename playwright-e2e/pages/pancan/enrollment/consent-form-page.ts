import { expect, Locator, Page } from '@playwright/test';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import { PancanPage } from 'pages/pancan/pancan-page';
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
    const bloodSamplesRadioButton = new Question(this.page, { prompt: 'You can work with me to arrange blood sample(s) to be drawn at my physician’s office, local clinic, or nearby lab facility.' });
    await bloodSamplesRadioButton.check('Yes', { exactMatch: true });
  }

  async cancerSamples(): Promise<void> {
    const cancerSamplesRadioButton = new Question(this.page, { prompt: 'You can request my stored cancer samples (e.g. tumor biopsies, surgical specimens, bone marrow samples, etc)' });
    await cancerSamplesRadioButton.check('Yes', { exactMatch: true });
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
