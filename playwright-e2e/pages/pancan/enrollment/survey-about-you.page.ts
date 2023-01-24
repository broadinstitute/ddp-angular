import { expect, Locator, Page } from '@playwright/test';
import Question from 'lib/component/Question';
import { PancanPage } from 'pages/pancan/pancan-page';

export default class SurveyAboutYouPage extends PancanPage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.sexAssignedAtBirth().toLocator().waitFor({ state: 'visible' });
  }

  /**
   * Question: Sex assigned at birth is the assignment and classification of people as male, female,
   *   or intersex based on a combination of external anatomy, internal anatomy, hormones, and chromosomes.
   * Type: Radiobutton
   * @returns {Question}
   */
  sexAssignedAtBirth(): Question {
    return new Question(this.page, { prompt: new RegExp(/What sex (were you|was your child) assigned at birth\?/) });
  }

  /**
   * Question: Gender identity is a term to describe a person's inner sense of being male, female, both,
   *   neither or some other gender. It can correspond to or differ from a person's sex assigned at birth.
   * Type: Checkbox
   * @param {string} label
   * @returns {Locator}
   */
  genderIdentity(label: string): Locator {
    return this.page
      .locator('.picklist-answer-GENDER_IDENTITY >> mat-checkbox')
      .filter({ has: this.page.locator(`text="${label}"`) });
  }

  //Question selectInput
  categoriesDescribesYou(label: string): Locator {
    return this.page.locator('.picklist-answer-RACE >> mat-checkbox').filter({ has: this.page.locator(`text="${label}"`) });
  }

  //Question radio-button
  tellUsAnythingElse(): Question {
    return new Question(this.page, { prompt: 'Tell us anything else you would like about yourself or your cancer.' });
  }

  //Question radio-button
  howDidYouHearAboutProject(): Question {
    return new Question(this.page, { prompt: 'How did you hear about the project?' });
  }

  async checkGenderIdentity(option: string): Promise<void> {
    const loc = this.genderIdentity(option);
    await loc.click();
    await expect(loc).toHaveClass(/checkbox-checked/);
  }

  async checkCategoriesDescribesYou(option: string) {
    const loc = this.categoriesDescribesYou(option);
    await loc.click();
    await expect(loc).toHaveClass(/checkbox-checked/);
  }
}
