import Question from 'dss/component/Question';
import { OsteoPageBase } from './osteo-page-base';
import { Locator, Page } from '@playwright/test';

export default class SurveyAboutYou extends OsteoPageBase {
  constructor(page: Page) {
    super(page);
  }

  sexAssignedAtBirth(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-BIRTH_SEX_ASSIGN' });
  }

  genderIdentity(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-GENDER_IDENTITY' });
  }

  raceQuestion(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-RACE-QUESTION' });
  }

  tellUsAboutYourselfOrYourCancer(): Locator {
    return this.page.locator(`//ddp-activity-answer//textarea[@data-ddp-test='answer:OTHER_COMMENTS']`);
  }

  howDidYouHearAboutProject(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-HOW_HEAR_QUESTION' });
  }

  howOftenHelpReceivedForHospitalMaterials(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-READ_HOSPITAL_MATERIALS_ID' });
  }

  howOftenDifficultyUnderstandingMedicalCondition(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-PROBLEM_UNDERSTANDING_WRITTEN_ID' });
  }

  howConfidentCompletingForms(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-CONFIDENCE_LEVEL_ID' });
  }

  highestLevelOfSchoolingCompleted(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-HIGHEST_LEVEL_SCHOOL_ID' });
  }

  langaugeSpokenAtHome(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-SPEAK_LANGUAGE_ID' });
  }
}
