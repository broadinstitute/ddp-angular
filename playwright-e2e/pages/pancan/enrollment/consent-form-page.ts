import { Page } from '@playwright/test';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import { PancanPage } from 'pages/pancan/pancan-page';

export default class ConsentFormPage extends PancanPage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.firstName().toLocator().waitFor({ state: 'visible' });
  }

  async bloodSamples(): Promise<void> {
    const bloodSamplesRadioButton = new Question(this.page, {
      prompt: 'You can work with me to arrange blood sample(s) to be drawn at my physician’s office, local clinic, or nearby lab'
    });
    await bloodSamplesRadioButton.check('Yes', { exactMatch: true });
  }

  async cancerSamples(): Promise<void> {
    const cancerSamplesRadioButton = new Question(this.page, {
      prompt: 'You can request my stored cancer samples (e.g. tumor biopsies, surgical specimens, bone marrow samples, etc)'
    });
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
}
