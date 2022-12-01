import { Locator, Page } from '@playwright/test';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import { PancanPage } from '../pancan-page';

export default class ConsentFormPage extends PancanPage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.firstName().toLocator().waitFor({ state: 'visible' });
  }

   async bloodSamples():Promise<void>{
    const bloodSamplesRadioButton = this.page.locator(`mat-radio-button[id=mat-radio-2]`);
    await bloodSamplesRadioButton.click();

  }
  async cancerSamples():Promise<void>{
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
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_FIRSTNAME' });
  }

  /**
   * <br> Question: Last Name
   * <br> Type: Input
   */
  lastName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_LASTNAME' });
  }

  /**
   * <br> Question: Your Signature (Full Name):
   * <br> Type: Input
   */
  signature(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_SIGNATURE' });
  }

  /**
   * <br> Question: AUTHORIZATION SIGNATURE
   * <br> Type: Input
   */
  authorizationSignature(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_SELF_SIGNATURE_SUBJECT' });
  }

  /**
   * <br> Question: Your Date of Birth
   * <br> Type: Input
   * @param month
   * @param date
   * @param year
   */
  async dateOfBirth(month: number | string, date: number | string, year: number | string): Promise<void> {
    const dob = new Question(this.page, { prompt: 'Date of Birth' });
    await dob.date().locator('input[data-placeholder="MM"]').fill(month.toString());
    await dob.date().locator('input[data-placeholder="DD"]').fill(date.toString());
    await dob.date().locator('input[data-placeholder="YYYY"]').fill(year.toString());
  }
}
