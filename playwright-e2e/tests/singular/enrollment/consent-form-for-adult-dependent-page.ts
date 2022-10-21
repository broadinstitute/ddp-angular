import { Page } from '@playwright/test';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import PageBase from 'lib/page-base';

export default class ConsentFormForAdultDependentPage extends PageBase {
  constructor(page: Page) {
    super(page);
  }

  /**
   * <br> Question: AUTHORIZATION SIGNATURE
   * <br> Type: Input
   */
  authorizationSignature(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_DEPENDENT_SIGNATURE_SUBJECT' });
  }

  /**
   * <br> Question: Enter first name of adult dependent
   * <br> Type: Input
   */
  dependentFirstName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_DEPENDENT_FIRST_NAME' });
  }

  /**
   * <br> Question: Enter last name of adult dependent
   * <br> Type: Input
   */
  dependentLastName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_DEPENDENT_LAST_NAME' });
  }

  /**
   * <br> Question: Your Dependent Date of Birth
   * <br> Type: Question
   */
  dateOfBirth(): Question {
    return new Question(this.page, { prompt: 'Your Dependent Date of Birth' });
  }

  /**
   * <br> Question: If a secondary finding is found in my genes:
   * <br> Type: Checkbox
   */
  toKnowSecondaryFinding(): Question {
    return new Question(this.page, { prompt: 'If a secondary finding is found in my genes:' });
  }

  selectOneForAdultDependent(): Question {
    return new Question(this.page, { prompt: 'Select one' });
  }

  /**
   * <br> Question: Signature of legally authorized representative/guardian who has obtained assent form study participant:
   * <br> Type: Input
   */
  dependentGuardianSignature(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_DEPENDENT_GUARDIAN_SIGNATURE' });
  }

  /** Click "Agree" button */
  async agree(): Promise<void> {
    const agreeButton = this.page.locator('button', { hasText: 'I agree' });
    await this.clickHelper(agreeButton, { waitForNav: true });
  }

  /** Click "I am not ready to agree" button */
  async notReadyToAgree(): Promise<void> {
    const notReadyButton = this.page.locator('button', { hasText: 'I am not ready to agree' });
    await this.clickHelper(notReadyButton, { waitForNav: true });
  }

  /**
   * Fill "Your Dependent Date of Birth"
   * @param month
   * @param date
   * @param year
   */
  async fillDateOfBirth(month: number | string, date: number | string, year: number | string): Promise<void> {
    const dob = this.dateOfBirth();
    await dob.date().locator('input[data-placeholder="MM"]').fill(month.toString());
    await dob.date().locator('input[data-placeholder="DD"]').fill(date.toString());
    await dob.date().locator('input[data-placeholder="YYYY"]').fill(year.toString());
  }
}