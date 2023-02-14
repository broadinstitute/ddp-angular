import { expect, Locator, Page } from '@playwright/test';
import TextArea from 'lib/widget/textarea';
import { AngioPageBase } from 'pages/angio/angio-page-base';
import { waitForNoSpinner } from 'utils/test-utils';
import { MONTH } from 'data/constants';
import Question from 'lib/component/Question';

export default class AboutYouPage extends AngioPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.PageHeader-title');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ visible: true });
    await expect(this.pageTitle).toHaveText('About you');
    await waitForNoSpinner(this.page);
  }

  /**
   * Question: When were you first diagnosed with angiosarcoma?
   * Type: Select
   *
   * @param month
   * @param year
   *
   */
  async whenDiagnosedWithAngiosarcoma(month: MONTH, year: string): Promise<void> {
    const question = new Question(this.page, { prompt: 'When were you first diagnosed with angiosarcoma?' });
    await question.select('month').selectOption({ label: month });
    await question.select('year').selectOption({ label: year });
  }

  /**
   * <br> Question: When you were first diagnosed with angiosarcoma, where in your body was it found (select all that apply)?
   * <br> Type: Checkbox
   */
  async whereFoundInBody(where: string[], inputText?: string[]): Promise<void> {
    const question = new Question(this.page, { prompt: 'where in your body was it found' });
    await this.conditionalQuestionHelper(question, where, inputText);
  }

  /**
   * <br> Question: Please select all of the places in your body that you have ever had angiosarcoma (select all that apply).
   * <br> Type: Checkbox
   */
  async whereHadInBody(where: string[], inputText?: string[]): Promise<void> {
    const question = new Question(this.page, {
      prompt: 'select all of the places in your body that you have ever had angiosarcoma'
    });
    await this.conditionalQuestionHelper(question, where, inputText);
  }

  /**
   * <br> Question: Please select all of the places in your body where you currently have angiosarcoma (select all that apply).
   * If you don’t have evidence of disease, please select "No Evidence of Disease (NED)".
   * <br> Type: Checkbox
   */
  async whereCurrentlyHaveInBody(where: string[], inputText?: string[]): Promise<void> {
    const question = new Question(this.page, {
      prompt: 'select all of the places in your body where you currently have angiosarcoma'
    });
    await this.conditionalQuestionHelper(question, where, inputText);
  }

  /**
   * <br> Question: Have you had surgery to remove angiosarcoma?
   * <br> Type: Checkbox
   * Have you had surgery to remove angiosarcoma?
   */
  async hadSurgeryToRemoveAngiosarcoma(answer: string): Promise<void> {
    const question = new Question(this.page, {
      prompt: 'Have you had surgery to remove angiosarcoma?'
    });
    await question.check(answer, { exactMatch: true });
  }

  /**
   * <br> Question: Have you had radiation as a treatment for angiosarcoma?
   * If you had radiation for other cancers, we will ask you about that later.
   * <br> Type: Checkbox
   */
  async hadRadiationTreatmentForAngiosarcoma(answer: string): Promise<void> {
    const question = new Question(this.page, {
      prompt: 'Have you had radiation as a treatment for angiosarcoma?'
    });
    await question.check(answer, { exactMatch: true });
  }

  /**
   * <br> Question: Are you currently being treated for your angiosarcoma?
   * <br> Type: Checkbox
   */
  async beingTreatedCurrentlyForAngiosarcoma(answer: string): Promise<void> {
    const question = new Question(this.page, {
      prompt: 'Are you currently being treated for your angiosarcoma?'
    });
    await question.check(answer, { exactMatch: true });
  }

  /**
   * <br> Question: Were you ever diagnosed with any other kind of cancer(s)?
   * <br> Type: Checkbox
   */
  async diagnosedWithOtherCancer(answer: string): Promise<void> {
    const question = new Question(this.page, {
      prompt: 'Were you ever diagnosed with any other kind of cancer(s)?'
    });
    await question.check(answer, { exactMatch: true });
  }

  /**
   * <br> Question: In what year were you born?
   * <br> Type: Select
   */
  async yearBorn(answer: string): Promise<string[]> {
    const question = new Question(this.page, {
      prompt: 'In what year were you born?'
    });
    await question.select().focus();
    return question.select().selectOption(answer);
  }

  /**
   * <br> Question: How did you hear about The Angiosarcoma Project?
   * <br> Type: Textarea
   */
  async howDidYouHearAbout(answer: string): Promise<void> {
    const question = new TextArea(this.page, { ddpTestID: 'answer:REFERRAL_SOURCE' });
    await question.fill(answer);
  }

  protected async conditionalQuestionHelper(question: Question, checkboxes: string[], inputText?: string[]) {
    for (let i = 0; i < checkboxes.length; i++) {
      if (inputText) {
        await question.checkAndFillInInput(checkboxes[i], { inputText: inputText[i] });
      } else {
        await question.check(checkboxes[i], { exactMatch: true });
      }
    }
  }
}
