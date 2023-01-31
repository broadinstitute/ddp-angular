import { Page } from '@playwright/test';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import { PancanPageBase } from 'pages/pancan/pancan-page-base';
import { PatientsData, TypePatient } from 'pages/patient-type';
import { generateUserName } from 'utils/faker-utils';
import * as user from 'data/fake-user.json';

export default class ConsentFormPage extends PancanPageBase {
  constructor(page: Page, private typePatient: TypePatient = 'adult') {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.firstName().toLocator().waitFor({ state: 'visible' });
  }

  /**
   * Question: You can work with me to arrange my child’s blood sample(s) to be drawn at my child’s physician’s office,
   *   local clinic, or nearby lab facility. You can perform (or work with others to perform) genomic and/or molecular tests on blood sample(s),
   *   and store the sample(s) until this research study is complete.
   * Type: Radiobutton
   * @returns {Promise<void>}
   */
  bloodSamples(): Question {
    return new Question(this.page, { cssClassAttribute: `.${PatientsData[this.typePatient].ddpTestID.bloodSamples}` });
  }

  async agreeToBloodSamples(answer = 'Yes'): Promise<void> {
    await this.bloodSamples().check(answer, { exactMatch: true });
  }

  // You can work with me to arrange blood sample(s) to be drawn at my physician’s office, local clinic, or nearby lab'
  //

  /**
   * Question: You can request my child’s stored cancer samples (e.g. tumor biopsies, surgical specimens, bone marrow samples, etc) from my child’s physicians
   *   and the hospitals and other places where my child received care, perform (or work with others to perform) genomic, histological,
   *   and/or molecular tests on the samples, and store the samples until this research study is complete.
   * Type: Radiobutton
   * @returns {Promise<void>}
   */
  cancerSamples(): Question {
    return new Question(this.page, {
      cssClassAttribute: `.${PatientsData[this.typePatient].ddpTestID.assentTissue}`
    });
  }

  async agreeToStoreCancerSamples(answer = 'Yes'): Promise<void> {
    await this.cancerSamples().check(answer, { exactMatch: true });
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
   * Used in Child enrollment.
   * @returns {Promise<void>}
   */
  async fillInParentData() {
    const parentFirstName = new Input(this.page, { ddpTestID: PatientsData[this.typePatient].ddpTestID.assentFirstName });
    const parentLastName = new Input(this.page, { ddpTestID: PatientsData[this.typePatient].ddpTestID.assentLastName });
    const parentSignature = new Input(this.page, { ddpTestID: PatientsData[this.typePatient].ddpTestID.assentSignature });
    const relationshipChild = new Question(this.page, { prompt: PatientsData[this.typePatient].ddpTestID.relationshipChild });
    const firstName = generateUserName(user[this.typePatient].firstName);
    const lastName = generateUserName(user[this.typePatient].lastName);
    await parentFirstName.fill(firstName);
    await parentLastName.fill(lastName);
    await parentSignature.fill(lastName);
    await relationshipChild.radioButton('Parent').locator('label').click();
  }
}
