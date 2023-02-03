import { Page } from '@playwright/test';
import { SingularPage } from 'pages/singular/singular-page';
import Question from 'lib/component/Question';
import Input from 'lib/widget/input';

export default class ConsentFormPage extends SingularPage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.firstName().toLocator().waitFor({ state: 'visible' });
  }

  /**
   * Your Name (Study Participant):
   */
  /**
   * <br> Question: First Name
   * <br> Type: Input
   */
  firstName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_SELF_FIRST_NAME' });
  }

  /**
   * <br> Question: Last Name
   * <br> Type: Input
   */
  lastName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_SELF_LAST_NAME' });
  }

  /**
   * <br> Question: Your Signature (Study Participant):
   * <br> Type: Input
   */
  signature(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_SELF_YOUR_SIGNATURE' });
  }

  /**
   * <br> Question: AUTHORIZATION SIGNATURE
   * <br> Type: Input
   */
  authorizationSignature(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_SELF_SIGNATURE_SUBJECT' });
  }

  /**
   * <br> Question: If a secondary finding is found in my genes:
   * <br> Type: Checkbox
   */
  toKnowSecondaryFinding(): Question {
    return new Question(this.page, { prompt: 'If a secondary finding is found in my genes:' });
  }
}
