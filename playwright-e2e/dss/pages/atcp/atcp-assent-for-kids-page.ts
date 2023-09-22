import { expect, Locator, Page } from '@playwright/test';
import Input from 'dss/component/input';
import Question from 'dss/component/Question';
import { AtcpPageBase } from 'dss/pages/atcp/atcp-page-base';
import { waitForNoSpinner } from 'utils/test-utils';

export default class AtcpAssentForKidsPage extends AtcpPageBase {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.page.locator('h1.activity-header')).toHaveText(/^Assent for Kids$/);
    await expect(this.getNextButton()).toBeVisible();
    await expect(this.page.locator('.activity-steps-kids')).toBeVisible();
    await expect(this.downloadAssentForm).toBeVisible();
    await waitForNoSpinner(this.page);
  }

  get downloadAssentForm(): Locator {
    return this.page.locator('a[download="A-T_Research_Assent_Form.EN.pdf"]');
  }

  /**
   * <br> Question: Study staff can contact me later with more questions or information about future research.
   * I do not have to answer these questions or take part in future research.
   *
   * <br> Type: Radiobutton
   */
  get canContactMeLater(): Question {
    return new Question(this.page, { cssClassAttribute: '.boolean-answer-CAN_CONTACT_LATER'});
  }

  /**
   * <br> Question: Study staff can do tests on the genes in my spit.
   *
   * <br> Type: Radiobutton
   */
  get canDoTestsOnGenes(): Question {
    return new Question(this.page, { cssClassAttribute: '.boolean-answer-ASSENT_CAN_DO_TESTS'});
  }

  /**
   * <br> Question: Study staff may ask my doctor or hospital to share information about my health.
   *
   * <br> Type: Radiobutton
   */
  get canAskMyDoctorAboutMyHealth(): Question {
    return new Question(this.page, { cssClassAttribute: '.boolean-answer-MAY_ASK_MY_DOCTOR'});
  }

  /**
   * <br> Question: Later, it might be possible to get the results of the tests on my genes. Please let me know if this becomes possible.
   *
   * <br> Type: Radiobutton
   */
  get canGetTestResults(): Question {
    return new Question(this.page, { cssClassAttribute: '.boolean-answer-GET_THE_RESULT'});
  }

  /**
   * <br> Question: If the researchers learn something about my health issues by testing my genes, please tell my doctor about this.
   *
   * <br> Type: Radiobutton
   */
  get canTellMyDoctorAboutLearnedResults(): Question {
    return new Question(this.page, { cssClassAttribute: '.boolean-answer-RESEARCHERS_LEARN_SOMETHING'});
  }

  /**
   * <br> Question: Signature of Child*
   *
   * <br> Type: Input
   */
  get signatureOfChild(): Question {
    return new Question(this.page, { cssClassAttribute: '.activity-text-input-ASSENT_CHILD_SIGNATURE'});
  }

  /**
   * <br> Question: Date of Birth of Child*
   *
   * <br> Type: Date
   */
  get dateOfBirthOfChild(): Question {
    return new Question(this.page, { cssClassAttribute: '.date-answer-ASSENT_DOB'});
  }

  get signatureOfParent(): Input {
    return new Input(this.page, { ddpTestID: 'answer:ASSENT_SIGNATURE_OF_PERSON_EXPLAINING' });
  }

  /**
   * <br> Question: Date*
   *
   * <br> Type: Input
   */
  get assentDate(): Question {
    return new Question(this.page, { cssClassAttribute: '.date-answer-ASSENT_DATE'});
  }
}
