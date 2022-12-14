import { expect, Locator, Page } from "@playwright/test";
import Question from "lib/component/Question";
import { PancanPage } from 'pages/pancan/pancan-page';

export default class SurveyAboutYouPage extends PancanPage {

  constructor(page: Page) {
    super(page);
  }
  async waitForReady(): Promise<void> {
    await this.sexAssignedAtBirth().toLocator().waitFor({state:'visible'});
  }
  //Question select
  sexAssignedAtBirth(): Question {
    return new Question(this.page, { prompt: 'What sex were you assigned at birth?' });

  }
  //Question select
  genderIdentity(label: string): Locator {
    return this.page.locator('.picklist-answer-GENDER_IDENTITY >> mat-checkbox').filter({has: this.page.locator(`text="${label}"`)});

  }
  //Question selectInput
  categoriesDecribesYou(label: string): Locator {
    return this.page.locator('.picklist-answer-RACE >> mat-checkbox').filter({has: this.page.locator(`text="${label}"`)});

  }
  //Question radio-button
  tellUsAnythingElse(): Question {
    return new Question(this.page,{prompt: 'Tell us anything else you would like about yourself or your cancer.'});

  }
  //Question radio-button
  howDidYouHearAboutProject(): Question {
    return new Question(this.page,{prompt: 'How did you hear about the project?'})
  }

  async checkGenderIdentity(option: string): Promise<void> {
    const loc = this.genderIdentity(option);
    await loc.click();
    await expect(loc).toHaveClass(/checkbox-checked/);
  }

  async checkCategoriesDecribesYou(option: string) {
    const loc = this.categoriesDecribesYou(option);
    await loc.click();
    await expect(loc).toHaveClass(/checkbox-checked/);
  }



}