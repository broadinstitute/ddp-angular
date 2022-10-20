import { Page } from '@playwright/test';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import Checkbox from 'lib/widget/checkbox';
import PageBase from 'lib/page-base';

export default class ConsentFormForMinorPage extends PageBase {
  constructor(page: Page) {
    super(page);
  }

  /**
   * <br> Question: AUTHORIZATION SIGNATURE
   * <br> Type: Input
   */
  authorizationSignature(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_PARENTAL_SIGNATURE_SUBJECT' });
  }

  /**
   * <br> Question: Enter child's first name
   * <br> Type: Input
   */
  childFirstName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_PARENTAL_CHILD_FIRST_NAME' });
  }

  /**
   * <br> Question: Enter child's last name
   * <br> Type: Input
   */
  childLastName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_PARENTAL_CHILD_LAST_NAME' });
  }

  /**
   * <br> Question: Your Child's Date of Birth
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
   * <br> Question: I have explained the study to the extent compatible with my child’s capability, and my child has agreed to be in the study.
   * <br> Type: Checkbox
   */
  iHaveExplainedToMyChild(): Checkbox {
    return new Checkbox(this.page, {
      label: 'I have explained the study'
    });
  }

  /**
   * <br> Question: If a secondary finding is found in my genes:
   * <br> Type: Checkbox
   */
  toKnowSecondaryFinding(): Question {
    return new Question(this.page, { prompt: 'If a secondary finding is found' });
  }

  /**
   * <br> Question: Parent/Guardian Signature:
   * <br> Type: Input
   */
  parentGuardianSignature(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_PARENTAL_GUARDIAN_SIGNATURE' });
  }

  /**
   * <br> Question: Parent first name
   * <br> Type: Input
   */
  parentFirstName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_PARENTAL_FIRST_NAME' });
  }

  /**
   * <br> Question: Parent last name
   * <br> Type: Input
   */
  parentLastName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_PARENTAL_LAST_NAME' });
  }

  /**
   * <br> Question: Relationship to subject
   * <br> Type: Checkbox
   */
  relationShipToSubject(): Question {
    return new Question(this.page, { prompt: 'Relationship to subject:' });
  }
}
