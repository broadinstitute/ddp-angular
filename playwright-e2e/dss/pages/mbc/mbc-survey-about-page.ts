import {expect, Locator, Page} from '@playwright/test';
import {MBCPatientsData as PatientsData, TypePatient} from '../mbc/mbc-patient-type';
import {waitForNoSpinner} from '../../../utils/test-utils';
import Question from '../../component/Question';
import {MBCPageBase} from './mbc-page-base';

enum CancerTypeQuestionText {
  BREAST_CANCER = 'When were you first diagnosed with breast cancer?',
  METASTATIC_BREAST_CANCER = 'When were you first diagnosed with metastatic breast cancer (also known as advanced or stage IV breast cancer)?',
  BIOPSY = 'When was your most recent biopsy of your cancer?'
}

type yesNoDontKnow = 'Yes' | 'No' | "I don't know";

export class MBCSurveyAboutPage extends MBCPageBase {
  constructor(page: Page, private typePatient: TypePatient = 'patient') {
    super(page);
  }

  /**
   * Wait for the page title
   */
  public async waitForReady(): Promise<void> {
    await expect(this.page.locator('h1.PageHeader-title')).toHaveText(PatientsData[this.typePatient].surveyForm);
    await waitForNoSpinner(this.page);
  }

  /**
   * <br> Question: When were you first diagnosed with breast cancer?
   */
  public async firstBreastCancerDiagnosedDate(month: string, year: string): Promise<void> {
    await this.chooseMonth(CancerTypeQuestionText.BREAST_CANCER).selectOption(month);
    await this.chooseYear(CancerTypeQuestionText.BREAST_CANCER).selectOption(year);
  }

  /**
   * <br> Question: When were you first diagnosed with metastatic breast cancer (also known as advanced or stage IV breast cancer)?
   */
  public async firstMetastaticBreastCancerDiagnosedDate(month: string, year: string): Promise<void> {
    await this.chooseMonth(CancerTypeQuestionText.METASTATIC_BREAST_CANCER).selectOption(month);
    await this.chooseYear(CancerTypeQuestionText.METASTATIC_BREAST_CANCER).selectOption(year);
  }

  /**
   * <br> Question: At any time, was your breast cancer found to be hormone receptor positive (HR+, ER+ and/or PR+)?
   */
  public async hrPositive(answer: yesNoDontKnow): Promise<void> {
    await new Question(this.page, {cssClassAttribute: '.picklist-answer-HR_POSITIVE'})
      .radioButton(answer, {exactMatch: true}).click();
  }

  /**
   * <br> Question: At any time, was your breast cancer found to be HER2 positive (HER2+)?
   */
  public async hr2Positive(answer: yesNoDontKnow): Promise<void> {
    await new Question(this.page, {cssClassAttribute: '.picklist-answer-HER2_POSITIVE'})
      .radioButton(answer, {exactMatch: true}).click();
  }

  /**
   * <br> Question: At any time, was your breast cancer found to be triple negative (e.g, NOT ER+, PR+ or HER2+)?
   */
  public async tripleNegative(answer: yesNoDontKnow): Promise<void> {
    await new Question(this.page, {cssClassAttribute: '.picklist-answer-TRIPLE_NEGATIVE'})
      .radioButton(answer, {exactMatch: true}).click();
  }

  /**
   * <br> Question: At any time, were you diagnosed with inflammatory breast cancer?
   */
  public async inflammatory(answer: yesNoDontKnow): Promise<void> {
    await new Question(this.page, {cssClassAttribute: '.picklist-answer-INFLAMMATORY'})
      .radioButton(answer, {exactMatch: true}).click();
  }

  /**
   * <br> Question: Since your diagnosis with metastatic breast cancer, have you been on any of your cancer therapies for more than 2 years?
   */
  public async therapies(answer: yesNoDontKnow): Promise<void> {
    await new Question(this.page, {cssClassAttribute: '.picklist-answer-THERAPIES'})
      .radioButton(answer, {exactMatch: true}).click();
  }

  /**
   * <br> Question: Have any of your therapies worked extraordinarily well-made your cancer disappear completely (resulting in no evidence of disease, NED) or resulted in a dramatic reduction in tumor size - for any period of time?
   */
  public async workedTherapies(answer: yesNoDontKnow): Promise<void> {
    await new Question(this.page, {cssClassAttribute: '.picklist-answer-WORKED_THERAPIES'})
      .radioButton(answer, {exactMatch: true}).click();
  }

  /**
   * <br> Question: If you have had an extraordinary response to therapy, tell us more about it.
   */
  public async extraordinaryTherapy(answer: string): Promise<void> {
    await new Question(this.page, {prompt: 'If you have had an extraordinary response to therapy, tell us more about it.'})
      .toTextarea()
      .fill(answer);
  }

  /**
   * <br> Question: When was your most recent biopsy of your cancer??
   */
  public async mostRecentBiopsyDate(month: string, year: string): Promise<void> {
    await this.chooseMonth(CancerTypeQuestionText.BIOPSY).selectOption(month);
    await this.chooseYear(CancerTypeQuestionText.BIOPSY).selectOption(year);
  }

  /**
   * <br> Question: About You
   */
  public async aboutYou(answer: string): Promise<void> {
    await new Question(this.page, {prompt: 'About You'})
      .toTextarea()
      .fill(answer);
  }

  /**
   * Question: In what year were you born?
   */
  public async birthYear(answer: string): Promise<any> {
    await new Question(this.page, {cssClassAttribute: '.date-answer-BIRTH_YEAR'})
      .toSelect()
      .toLocator()
      .selectOption(answer)
  }

  /**
   * Question: What country do you live in?
   */
  public async countryLiveIn(answer: string): Promise<any> {
    await this.country()
      .toSelect()
      .selectOption(answer)
  }

  /**
   * <br> Question: What is your ZIP or postal code?
   */
  public async fillInZipCode(answer: string): Promise<void> {
    await new Question(this.page, {prompt: 'What is your ZIP or postal code?'})
      .toInput()
      .fill(answer);
  }

  /**
   * <br> Question: Which categories describe you? Select all that apply. Note, you may select more than one group.
   */
  public async race(answer: string, secondAnswer = ''): Promise<void> {
    const question = new Question(this.page, {cssClassAttribute: '.picklist-answer-SELF_RACE'});
    await question.toCheckbox(answer).check();
    if (secondAnswer) {
      await question.toCheckbox(secondAnswer).check();
    }
  }

  /**
   * <br> Question: What is your gender identity? Select all that apply
   */
  public async gender(answer: string, secondAnswer = ''): Promise<void> {
    const question = new Question(this.page, {cssClassAttribute: '.picklist-answer-GENDER_IDENTITY'});
    await question.toCheckbox(answer).check();
    if (secondAnswer) {
      await question.toCheckbox(secondAnswer).check();
    }
  }

  /**
   * <br> Question: What sex were you assigned at birth?
   */
  public async sex(answer: string): Promise<void> {
    await new Question(this.page, {cssClassAttribute: '.picklist-answer-ASSIGNED_SEX'})
      .radioButton(answer, {exactMatch: true}).click();
  }

  /**
   * <br> Question: How did you hear about the MBCproject?
   */
  public async howDidYouHear(answer: string): Promise<void> {
    await new Question(this.page, {prompt: 'How did you hear about the MBCproject?'})
      .toTextarea()
      .fill(answer);
  }


  /* Helper functions */

  private chooseYear(questionText: string): Locator {
    return new Question(this.page, { prompt: questionText })
      .toSelect('Choose year...')
      .toLocator();
  }

  private chooseMonth(questionText: string): Locator {
    return new Question(this.page, { prompt: questionText })
      .toSelect('Choose month...')
      .toLocator();
  }
}
