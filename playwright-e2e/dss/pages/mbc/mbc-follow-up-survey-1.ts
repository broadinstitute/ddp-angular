import {MBCPageBase} from './mbc-page-base';
import {expect, Locator, Page} from '@playwright/test';
import {waitForNoSpinner} from 'utils/test-utils';
import Question from '../../component/Question';

type yesNoDontKnow = 'Yes' | 'No' | "I don't know";

interface MedicationDetails {
  medication: string,
  startDate: {
    month: string,
    year: string
  },
  endDate?: {
    month: string,
    year: string
  }
}

export class MBCFollowUpSurvey1 extends MBCPageBase {
  private readonly pageTitle: Locator;
  private readonly title = 'Follow-up survey #1: Additional details about your cancer & treatments';

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.PageHeader-title');
  }

  public async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toHaveText(this.title);
    await waitForNoSpinner(this.page);
  }

  /**
   * <br> Question: Please select all the places in your body where you currently have metastatic breast cancer to the best of your knowledge (select all that apply). If you don’t have any detectable disease please select No Evidence of Disease (NED).
   */
  public async currentCancerLocation(answer: string): Promise<void> {
    const question = new Question(this.page, {cssClassAttribute: '.picklist-answer-CURRENT_CANCER_LOC'});
    await question.toCheckbox(answer).check();
  }

  /**
   * <br> Question: When you were first diagnosed with metastatic breast cancer, where were all of the places in your body that it was detected (select all that apply)?
   */
  public async diagnosisCancerLocation(answer: string): Promise<void> {
    const question = new Question(this.page, {cssClassAttribute: '.picklist-answer-DIAGNOSIS_CANCER_LOC'});
    await question.toCheckbox(answer).check();
  }

  /**
   * <br> Question: Please select all of the places in your body that metastatic breast cancer has been found at any time (select all that apply)?
   */
  public async anytimeCancerLocation(answer: string): Promise<void> {
    const question = new Question(this.page, {cssClassAttribute: '.picklist-answer-ANYTIME_CANCER_LOC'});
    await question.toCheckbox(answer).check();
  }

  /**
   * <br> Question: Was your breast cancer identified as any of the following at any time (select all that apply)?
   */
  public async cancerIdentification(answer: string): Promise<void> {
    const question = new Question(this.page, {cssClassAttribute: '.picklist-answer-CANCER_IDENTIFICATION'});
    await question.toCheckbox(answer).check();
  }

  /**
   * <br> Question: Are you currently receiving any medications/chemotherapies for treatment of your metastatic breast cancer?
   */
  public async currentlyMedicated(answer: yesNoDontKnow, opts?: MedicationDetails): Promise<void> {
    await new Question(this.page, {cssClassAttribute: '.picklist-answer-CURRENTLY_MEDICATED'})
      .radioButton(answer, {exactMatch: true}).click();
    if (opts) {
      await this.currentMedicationAnswer(opts);
    }
  }

  /**
   * <br> Question: Have you received any other medications/chemotherapies in the past for treatment of your metastatic breast cancer?
   */
  public async previouslyMedicated(answer: yesNoDontKnow, opts?: MedicationDetails): Promise<void> {
    await new Question(this.page, {cssClassAttribute: '.picklist-answer-PREVIOUSLY_MEDICATED'})
      .radioButton(answer, {exactMatch: true}).click();
    if (opts) {
      await this.pastMedicationAnswer(opts);
    }
  }

  /* Helper functions */
  private async currentMedicationAnswer(opts: MedicationDetails): Promise<void> {
    await this.page.waitForLoadState('networkidle');

    if (opts?.medication) {
      const medication = new Question(this.page, {cssClassAttribute: '.composite-answer-CURRENT_MED_LIST'});
      await medication.toInput().fill(opts.medication);
    }

    await this.fillCurrentAndPastMedicationDates('CURRENT', opts);
  }

  private async pastMedicationAnswer(opts: MedicationDetails): Promise<void> {
    if (opts?.medication) {
      const medication = new Question(this.page, {cssClassAttribute: '.composite-answer-PAST_MED_LIST'});
      await medication.toInput().fill(opts.medication);
    }
    await this.fillCurrentAndPastMedicationDates('PAST', opts);
  }

  private async fillCurrentAndPastMedicationDates(cssClassPart: 'CURRENT' | 'PAST', {
    startDate,
    endDate
  }: MedicationDetails): Promise<void> {
    if (startDate) {
      const startDateQuestion = new Question(this.page,
        {
          cssClassAttribute: '.picklist',
          parentSelector: this.page.locator(`.date-answer-${cssClassPart}_MED_START`)
        });
      await startDateQuestion.toSelect('Choose month...')
        .toLocator()
        .selectOption(startDate.month);

      await startDateQuestion.toSelect('Choose year...')
        .toLocator()
        .selectOption(startDate.year)
    }

    if (endDate) {
      const endDateQuestion = new Question(this.page,
        {
          cssClassAttribute: '.picklist',
          parentSelector: this.page.locator(`.date-answer-${cssClassPart}_MED_END`)
        }
      );
      await endDateQuestion.toSelect('Choose month...')
        .toLocator()
        .selectOption(endDate.month);

      await endDateQuestion.toSelect('Choose year...')
        .toLocator()
        .selectOption(endDate.year);
    }
  }
}
