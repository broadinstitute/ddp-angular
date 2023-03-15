import { expect, Locator, Page } from '@playwright/test';
import Question from 'lib/component/Question';
import { PancanPageBase } from 'pages/pancan/pancan-page-base';

export default class SurveyAboutCancerPage extends PancanPageBase {
  private readonly pageTitle: Locator;
  constructor(page: Page, readonly expectedTitle?: string) {
    super(page);
    this.pageTitle = this.page.locator('h1.activity-header');
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    this.expectedTitle && await expect(this.pageTitle).toHaveText(this.expectedTitle);
  }

  /**
   * <br> Question: When were you first diagnosed?
   * <br> Type: Locator
   */
  private firstDiagnosedMonth(): Locator {
    return new Question(this.page, { prompt: new RegExp(/When (were|was) (you|your child) first diagnosed/) })
      .toSelect('Choose month...')
      .toLocator();
  }

  /**
   * <br> Question: When were you first diagnosed with Cervical cancer?
   * <br> Type: Locator
   */
  private firstDiagnosedYear(): Locator {
    return new Question(this.page, { prompt: new RegExp(/When (were|was) (you|your child) first diagnosed/) }).toSelect('Choose year...').toLocator();
  }

  /**
   * <br> Question: When did you first experience symptoms...?
   * <br> Type: Locator
   */
  async chooseTimeframe(option: string): Promise<void> {
    await new Question(this.page, { prompt: new RegExp(/When did you first experience symptoms/) })
    .toSelect('Choose timeframe...')
    .toLocator()
      .selectOption(option);
  }

  /**
   * <br> Question: Please select the places in the body where you had cancer when you was first diagnosed.
   * <br> Type: Question
   */
  initialBodyLocation(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-INITIAL_BODY_LOC' });
    // return this.page.locator('.picklist-answer-INITIAL_BODY_LOC').locator('input');
  }

  /**
   * <br> Question: Please select all the places in your body that you currently have ...
   * <br> Type: Question
   */
  currentBodyLocation(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-CURRENT_BODY_LOC' });
  }

  /**
   * <br> Question: Have you had radiation as a treatment for  ...
   * <br> Type: Question
   */
  hadRadiationAsTreatment(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-HAD_RADIATION' });
  }

  hadReceivedTherapies(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-THERAPIES_RECEIVED'});
  }

  /**
   * <br> Question: Are you currently being treated for  ...
   * <br> Type: Question
   */
  currentlyBeingTreated(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-CURRENTLY_TREATED'});
  }

  /**
   * <br> Question: Have you ever been diagnosed with any other cancer(s)?
   * <br> Type: Question
   */
  hadDiagnosedWithOtherCancer(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-OTHER_CANCERS'});
  }


  /**
   * <br> Question: Are you currently cancer-free (e.g. in remission, no evidence of disease (NED), no evidence of active disease (NEAD))?
   * <br> Type: Radio-button
   */
  cancerFree(): Question {
    return new Question(this.page, {
      prompt: new RegExp(
        /(Are you|Is your child) currently cancer-free \(e.g. in remission, no evidence of disease \(NED\), no evidence of active disease \(NEAD\)\)/
      )
    });
  }

  /**
   * <br> Question: Please select all the places in the body where you have ever had cancer to the best of your knowledge.
   * <br> Type: Input
   */
  bodyPlacesEverHadCancer() {
    return this.page.locator('.picklist-answer-EVER_BODY_LOC').locator('input');
  }

  /**
   * <br> Question: Have you received any of the following treatments or procedures for your cancer?
   * <br> Type: checkbox
   */
  treatmentsReceived(label: string): Locator {
    return this.page.locator('.picklist-answer-TREATMENTS').locator('mat-checkbox').filter({ hasText: label });
  }

  /**
   * <br> Question: Please list all medications/chemotherapies that you have previously received and are currently receiving for the treatment of your cancer
   * <br> Type: Input
   */
  medicationsList(): Locator {
    return this.page.locator('.activity-text-input-THERAPY_NAME').locator('input');
  }

  async fillInDiagnosedDate(month: string, year: string) {
    await this.firstDiagnosedMonth().selectOption({ label: month });
    await this.firstDiagnosedYear().selectOption(year);
  }

  async fillBodyPlacesEverHadCancer(value: string) {
    await this.bodyPlacesEverHadCancer().fill(value);
    await this.bodyPlacesEverHadCancer().press('Tab');
  }

  /**
   * Question: Has your child received any of the following treatments or procedures for their cancer?
   * Type: Checkbox list
   * @param {string} option
   * @returns {Promise<void>}
   */
  async checkTreatmentsReceived(option: string) {
    await this.treatmentsReceived(option).click();
    await expect(this.treatmentsReceived('Radiation')).toHaveClass(/checkbox-checked/);
  }
}
