import { expect, Locator, Page } from '@playwright/test';
import Question from 'dss/component/Question';
import { LmsPageBase } from 'dss/pages/lms/lms-page-base';
import { waitForNoSpinner } from 'utils/test-utils';

export default class SurveyAboutLmsPage extends LmsPageBase {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await expect(this.page.locator('h1.activity-header')).toHaveText('Survey: Your LMS');
    await waitForNoSpinner(this.page);
  }

  /**
   * <br> Question: When were you first diagnosed with leiomyosarcoma (LMS)?
   * <br> Type: Locator
   */
  private firstDiagnosedMonth(): Locator {
    return new Question(this.page, { prompt: new RegExp(/When (were|was) (you|your child) first diagnosed with leiomyosarcoma/) })
    .toSelect('Select month...')
    .toLocator();
  }

  /**
   * <br> Question: When were you first diagnosed with leiomyosarcoma (LMS)?
   * <br> Type: Locator
   */
  private firstDiagnosedYear(): Locator {
    return new Question(this.page, { prompt: new RegExp(/When (were|was) (you|your child) first diagnosed with leiomyosarcoma/) })
    .toSelect('Select year...')
    .toLocator();
  }

  async fillInDiagnosedDate(month: string, year: string) {
    await this.firstDiagnosedMonth().selectOption({ label: month });
    await this.firstDiagnosedYear().selectOption(year);
  }

  /**
   * <br> Question: Please select the places in the body where you had cancer when you were first diagnosed.
   * <br> Type: Input
   */
  bodyLocationWhenFirstDiagnosed(): Question {
    return new Question(this.page, { cssClassAttribute: '.composite-answer-INITIAL_BODY_LOC_LIST' });
  }

  /**
   * <br> Question: Are you currently cancer-free (e.g. in remission, no evidence of disease (NED) or no evidence of active disease (NEAD))?
   * <br> Type: Checkbox
   */
  areYouCancerFree(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-CANCER_FREE' });
  }

  /**
   * <br> Question: Please select all the places in the body where you have ever had cancer to the best of your knowledge.
   * <br> Type: Input
   */
  bodyLocationEverHad(): Question {
    return new Question(this.page, { cssClassAttribute: '.composite-answer-HAD_BODY_LOC_LIST' });
  }

  /**
   * <br> Question: Have you received any of the following treatments or procedures for your cancer?
   * <br> Type: Checkbox
   * @returns {Question}
   */
  hadReceivedTherapies(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-TREATMENTS'});
  }

  /**
   * <br> Question: Please list all medications/chemotherapies that you have previously received or are currently receiving for the treatment of your cancer.
   * <br> Type: Input
   */
  medicationsChemotherapyReceived(): Question {
    return new Question(this.page, { cssClassAttribute: '.composite-answer-THERAPY_LIST'});
  }
}
