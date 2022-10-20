import { Page } from '@playwright/test';
import { SingularPage } from 'pages/singular/singular-page';
import Input from 'lib/widget/Input';
import Select from 'lib/widget/select';
import Question from 'lib/component/Question';

export default class PatientSurveyPage extends SingularPage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    // Add additional checks to wait for page is ready
    await this.cityBornIn()
      .toLocator()
      .waitFor({ state: 'visible', timeout: 60 * 1000 });
  }

  /**
   * <br> Question: What city did you live in when they were born?
   * <br> Type: Input
   */
  cityBornIn(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CITY_BORN' });
  }

  /**
   * <br> Question: What state or province did you live in when they were born?
   * <br> Type: Select
   */
  stateBornIn(): Select {
    return new Select(this.page, { label: 'Choose state' });
  }

  /**
   * <br> Question: If you remember, what was the zip code or postal code of the city you lived in when you were born?
   * <br> Type: Input
   */
  zipCodeCityBornIn(): Input {
    return new Input(this.page, { ddpTestID: 'answer:ZIP_BORN_CITY' });
  }

  /**
   * <br> Question: What is your current zip code?
   * <br> Type: Input
   */
  currentZipCode(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CURRENT_ZIP' });
  }

  /**
   * <br> Question: What was your recorded sex at birth?
   * <br> Type: Radiobutton
   */
  sexAtBirth(): Question {
    return new Question(this.page, { prompt: 'What was your recorded sex at birth?' });
  }

  /**
   * <br> Question: What is your race?
   * <br> Type: Checkbox
   */
  race(): Question {
    return new Question(this.page, { prompt: 'What is your race?' });
  }

  /**
   * <br> Question: Are you of Hispanic or Latino ethnicity?
   * <br> Type: Radiobutton
   */
  isHispanic(): Question {
    return new Question(this.page, { prompt: 'Are you of Hispanic or Latino ethnicity?' });
  }

  /**
   * <br> Question: Select your single ventricle diagnosis from the list provided.*
   *      If you are unsure, choose your best guess or select other.
   * <br> Type: Radiobutton
   */
  selectVentricleDiagnosis(): Question {
    return new Question(this.page, { prompt: 'Select your single ventricle diagnosis from the list provided' });
  }

  /**
   * <br> Question: What is your current height in feet and inches?
   * <br> Type: Input
   */
  heightInFeet(): Input {
    return new Input(this.page, { ddpTestID: 'answer:WHAT_IS_YOUR_HEIGHT_FEET' });
  }

  /**
   * <br> Question: What is your current height in feet and inches?
   * <br> Type: Input
   */
  heightInInches(): Input {
    return new Input(this.page, { ddpTestID: 'answer:WHAT_IS_YOUR_HEIGHT_INCHES' });
  }

  /**
   * <br> Question: What is your current weight in pounds?
   * <br> Type: Input
   */
  weightInPounds(): Input {
    return new Input(this.page, { ddpTestID: 'answer:WHAT_IS_YOUR_WEIGHT' });
  }
}
