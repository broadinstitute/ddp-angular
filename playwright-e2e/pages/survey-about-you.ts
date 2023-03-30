import { expect, Page } from '@playwright/test';
import Question from 'lib/component/Question';
import PageBase from 'pages/page-base';

/**
 * "Survey About You" is a page commonly found in most studies
 */
export default class SurveyAboutYou extends PageBase {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.page.locator('h1.activity-header')).toHaveText(/Survey: About (You|Your Child)/);
  }

  /**
   * <br> Question: What sex were you assigned at birth?
   * <br> Type: Radiobutton
   * @returns {Question}
   */
  sex(): Question {
    return new Question(this.page, { prompt: new RegExp(/What sex (were you|was your child) assigned at birth\?/) });
  }

  /**
   * <br> Question: What is your gender identity?
   * <br> Type: Checkbox
   * @returns {Question}
   */
  gender(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-GENDER_IDENTITY >> mat-checkbox' });
  }

  /**
   * <br> Question: Which of the following categories best describes you?
   * <br> Type: Checkbox
   * @returns {Question}
   */
  race(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-RACE-QUESTION, .picklist-answer-RACE' });
  }

  /**
   * <br> Question: Do you consider yourself to be mixed race, that is belonging to more than one racial group, such as Mestizo, Mulatto or some other mixed race?
   * <br> Type: Radiobutton
   * @returns {Question}
   */
  isMixedRace(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-MIXED_RACE' });
  }

  /**
   * <br> Question: Do you consider yourself to be indigenous or Native American
   * <br> Type: Radiobutton
   * @returns {Question}
   */
  isIndigenousNative(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-INDIGENOUS_NATIVE' });
  }

  /**
   * <br> Question: Tell us anything else you would like about yourself or your cancer.
   * <br> Type: Textarea
   * @returns {Question}
   */
  tellUsAnythingElse(): Question {
    return new Question(this.page, { prompt: 'Tell us anything else you would like about yourself or your cancer.' });
  }

  /**
   * <br> Question: How did you hear about the project?
   * <br> Type: Checkbox
   * @returns {Question}
   */
  howDidYouHearAboutProject(): Question {
    return new Question(this.page, { prompt: 'How did you hear about the project?' });
  }

  /**
   * <br> Question: How often do you have someone (like a family member, friend, hospital/clinic worker or caregiver) help you read hospital materials?
   * <br> Type: Radiobutton
   * @returns {Question}
   */
  howOftenDoYouNeedHelpReadHospitalMaterials(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-READ_HOSPITAL_MATERIALS_ID' });
  }

  /**
   * <br> Question: How often do you have problems learning about your medical condition because of difficulty understanding written information?
   * <br> Type: Radiobutton
   * @returns {Question}
   */
  howOftenDoYouHaveProblemsUnderstandWrittenInformation(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-PROBLEM_UNDERSTANDING_WRITTEN_ID' });
  }

  /**
   * <br> Question: How confident are you filling out forms by yourself?
   * <br> Type: Radiobutton
   * @returns {Question}
   */
  howConfidentAreYouFillingOutFormsByYourself(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-CONFIDENCE_LEVEL_ID' });
  }

  /**
   * <br> Question: What is the highest level of school you have completed? Please check one.
   * <br> Radiobutton
   * @returns {Question}
   */
  highestLevelOfSchoolCompleted(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-HIGHEST_LEVEL_SCHOOL_ID' });
  }

  /**
   * <br> Question: What language do you speak at home?
   * <br> Type: Radiobutton
   * @returns {Question}
   */
  speakLanguage(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-SPEAK_LANGUAGE_ID' });
  }
}
