import { Page } from '@playwright/test';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import PageBase from 'lib/page-base';

export default class ConsentFormPage extends PageBase {
  constructor(page: Page) {
    super(page);
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

  /**
   * <br> Question: If a secondary finding is found in my genes:
   * <br> Type: Checkbox
   */
  toKnowSecondaryFinding(): Question {
    return new Question(this.page, { prompt: 'If a secondary finding is found in my genes:' });
  }
}
