import { expect, Locator, Page } from '@playwright/test';
import Question from 'lib/component/Question';
import { PancanPageBase } from 'pages/pancan/pancan-page-base';

export default class SurveyAboutYouPage extends PancanPageBase {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.sexAtBirth().toLocator().waitFor({ state: 'visible' });
  }

  /**
   * Question: Sex assigned at birth is the assignment and classification of people as male, female,
   *   or intersex based on a combination of external anatomy, internal anatomy, hormones, and chromosomes.
   * Type: Radiobutton
   * @returns {Question}
   */
  sexAtBirth(): Question {
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
    return this.page.locator('.picklist-answer-GENDER_IDENTITY >> mat-checkbox').filter({ has: this.page.locator(`text="${label}"`) });
  }

  //Question selectInput
  raceCategoriesDescribesYou(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-RACE-QUESTION, .picklist-answer-RACE' });
  }

  /**
   * Question: Do you consider yourself to be mixed race, that is belonging to more than one racial group
   * @returns {Question}
   */
  mixedRace(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-MIXED_RACE' });
  }

  /**
   * Question: Do you consider yourself to be indigenous or Native American
   * @returns {Question}
   */
  indigenousNative(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-INDIGENOUS_NATIVE' });
  }

  /**
   * Question: Tell us anything else you would like about yourself or your cancer.
   */
  tellUsAnythingElse(): Question {
    return new Question(this.page, { prompt: 'Tell us anything else you would like about yourself or your cancer.' });
  }

  //Question radio-button
  howDidYouHearAboutProject(): Question {
    return new Question(this.page, { prompt: 'How did you hear about the project?' });
  }

  /**
   * Question: How often do you have someone (like a family member, friend, hospital/clinic worker or caregiver) help you read hospital materials?
   * @returns {Question}
   */
  howOftenDoYouNeedHelpReadHospitalMaterials(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-READ_HOSPITAL_MATERIALS_ID' });
  }

  /**
   * Question: How often do you have problems learning about your medical condition because of difficulty understanding written information?
   * @returns {Question}
   */
  howOftenDoYouHaveProblemsUnderstandWrittenInformation(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-PROBLEM_UNDERSTANDING_WRITTEN_ID' });
  }

  /**
   * Question: How confident are you filling out forms by yourself?
   * @returns {Question}
   */
  howConfidentAreYouFillingOutFormsByYourself(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-CONFIDENCE_LEVEL_ID' });
  }

  /**
   * Question: What is the highest level of school you have completed? Please check one.
   * @returns {Question}
   */
  whatIsHighestLevelOfSchoolCompleted(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-HIGHEST_LEVEL_SCHOOL_ID' });
  }

  /**
   * Question: What language do you speak at home?
   * @returns {Question}
   */
  whatLanguageDoYouSpeak(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-SPEAK_LANGUAGE_ID' });
  }

  async checkGenderIdentity(option: string): Promise<void> {
    const loc = this.genderIdentity(option);
    await loc.click();
    await expect(loc).toHaveClass(/checkbox-checked/);
  }

  async fillInSurveyAboutYou(opts: { sex?: string; gender?: string; race?: string; howDidYouHearAboutProject?: string } = {}): Promise<void> {
    const { sex = 'Male', gender = 'Man', race = 'White', howDidYouHearAboutProject = 'Social media (Facebook, Twitter, Instagram, etc.)' } = opts;
    await this.waitForReady();
    await this.sexAtBirth().radioButton(sex, { exactMatch: true }).locator('label').click();
    await this.checkGenderIdentity(gender);
    await this.raceCategoriesDescribesYou().toCheckbox(race).check();
    await this.raceCategoriesDescribesYou().toCheckbox('English').check();
    await this.howDidYouHearAboutProject().check(howDidYouHearAboutProject);
    await this.howDidYouHearAboutProject().check('Facebook', { exactMatch: true });
  }
}
