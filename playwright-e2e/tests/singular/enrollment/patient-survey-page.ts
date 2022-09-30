import { Locator, Page } from '@playwright/test';
import Question from 'tests/lib/Question';

export default class PatientSurveyPage {
  private readonly page: Page;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.submitButton = page.locator('button', { hasText: 'Submit' });
  }

  get submit(): Locator {
    return this.submitButton;
  }

  cityBornIn(): Locator {
    return new Question(this.page, 'What city did you live in when you were born?').textInput();
  }

  stateOrProvince(): Locator {
    return new Question(this.page, 'What state or province did you live in when you were born?').select();
  }

  oldZipCode(): Locator {
    return new Question(
      this.page,
      'what was the zip code or postal code of the city you lived in when you were born?'
    ).textInput();
  }

  currentZipCode(): Locator {
    return new Question(this.page, 'What is your current zip code?').textInput();
  }

  setAtBirth(label: string): Locator {
    return new Question(this.page, 'What was your recorded sex at birth?').check(label);
  }

  race(label: string | RegExp): Locator {
    return new Question(this.page, 'What is your race?').check(label);
  }

  isHispanic(label: string | RegExp): Locator {
    const regex = new RegExp(`^\\s*${label}\\s*$`); // Use Regex here to avoid matching "Prefer not to answer"
    return new Question(this.page, 'Are you of Hispanic or Latino ethnicity?').check(regex);
  }

  ventricleDiagnosis(label: string): Locator {
    return new Question(this.page, 'Select your single ventricle diagnosis from the list provided').check(label);
  }
}
