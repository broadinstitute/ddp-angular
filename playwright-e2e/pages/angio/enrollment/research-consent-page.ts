import { expect, Locator, Page } from '@playwright/test';
import { AngioPageBase } from 'pages/angio/angio-page-base';
import { waitForNoSpinner } from 'utils/test-utils';
import Question from 'lib/component/Question';
import Input from 'lib/widget/input';

export default class ResearchConsentPage extends AngioPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.PageHeader-title');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText('Research Consent Form');
    await waitForNoSpinner(this.page);
  }

  /**
   * Question: You can work with me to arrange a sample of blood to be drawn at my physician’s office, local clinic, or nearby lab facility.
   * Type: Radiobutton
   */
  async agreeToArrangeSampleBloodDrawn(answer: string): Promise<void> {
    const question = new Question(this.page, {
      prompt: 'You can work with me to arrange a sample of blood to be drawn'
    });
    await question.check(answer);
  }

  /**
   * <br> Question: You can request my stored tissue samples from my physicians and the hospitals and other places where I received my care,
   * perform (or collaborate with others to perform) gene tests on the samples, and store the samples until this research study is complete.
   * <br> Type: Radiobutton
   */
  async canRequestMyStoredTissueSamples(answer: string): Promise<void> {
    const question = new Question(this.page, {
      prompt: 'You can request my stored tissue samples from my physicians and the hospitals'
    });
    await question.check(answer);
  }

  /**
   * <br> Signature: Your Full Name
   * <br> Type: Input
   */
  async fullName(answer: string): Promise<void> {
    const input = new Input(this.page, { ddpTestID: 'answer:CONSENT_FULLNAME' });
    await input.fill(answer);
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
    await this.questionHelper(question, where, inputText);
  }

  /**
   * <br> Question: Have you had surgery to remove angiosarcoma?
   * <br> Type: Checkbox
   */
  async hadSurgeryToRemoveAngiosarcoma(answer: string): Promise<void> {
    const question = new Question(this.page, {
      prompt: 'Have you had surgery to remove angiosarcoma?'
    });
    await question.check(answer);
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
    await question.check(answer);
  }

  /**
   * <br> Question: Are you currently being treated for your angiosarcoma?
   * <br> Type: Checkbox
   */
  async beingTreatedCurrentlyForAngiosarcoma(answer: string): Promise<void> {
    const question = new Question(this.page, {
      prompt: 'Are you currently being treated for your angiosarcoma?'
    });
    await question.check(answer);
  }

  /**
   * <br> Question: Were you ever diagnosed with any other kind of cancer(s)?
   * <br> Type: Checkbox
   */
  async diagnosedWithOtherCancer(answer: string): Promise<void> {
    const question = new Question(this.page, {
      prompt: 'Were you ever diagnosed with any other kind of cancer(s)?'
    });
    await question.check(answer);
  }

  /**
   * <br> Question: In what year were you born?
   * <br> Type: Select
   */
  async yearBorn(answer: string): Promise<void> {
    const question = new Question(this.page, {
      prompt: 'In what year were you born?'
    });
    await question.toSelect().selectOption(answer);
  }

  private async questionHelper(question: Question, checkboxes: string[], inputText?: string[]) {
    for (let i = 0; i < checkboxes.length; i++) {
      if (inputText) {
        await question.checkAndFillInInput(checkboxes[i], { inputText: inputText[i] });
      } else {
        await question.check(checkboxes[i], { exactMatch: true });
      }
    }
  }
}
