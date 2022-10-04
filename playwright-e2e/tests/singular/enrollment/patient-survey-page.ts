import { Page } from '@playwright/test';
import Question from 'tests/lib/widget/Question';

export default class PatientSurveyPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  cityBornIn(): Question {
    return new Question(this.page, 'What city did you live in when you were born?');
  }

  stateOrProvince(): Question {
    return new Question(this.page, 'What state or province did you live in when you were born?');
  }

  oldZipCode(): Question {
    return new Question(this.page, 'what was the zip code or postal code of the city you lived in when you were born?');
  }

  currentZipCode(): Question {
    return new Question(this.page, 'What is your current zip code?');
  }

  setAtBirth(): Question {
    return new Question(this.page, 'What was your recorded sex at birth?');
  }

  race(): Question {
    return new Question(this.page, 'What is your race?');
  }

  isHispanic(): Question {
    return new Question(this.page, 'Are you of Hispanic or Latino ethnicity?');
  }

  ventricleDiagnosis(): Question {
    return new Question(this.page, 'Select your single ventricle diagnosis from the list provided');
  }

  async submit(): Promise<void> {
    const submitButton = this.page.locator('button', { hasText: 'Submit' });
    await Promise.all([this.page.waitForNavigation(), this.page.waitForLoadState('load'), submitButton.click()]);
  }
}
