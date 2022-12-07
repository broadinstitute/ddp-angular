import { expect, Locator, Page } from '@playwright/test';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import Select from 'lib/widget/select';
import TextArea from 'lib/widget/textarea';
import { RgpPageBase } from 'pages/rgp/rgp-page-base';
import { waitForNoSpinner } from 'utils/test-utils';

export default class TellUsAboutYourFamilyPage extends RgpPageBase {
  private activityText: Locator;

  constructor(page: Page) {
    super(page);
    this.activityText = this.page.locator('h1.activity-header');
  }

  async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
    await expect(this.activityText).toBeVisible({ visible: true });
    await expect(this.activityText).toHaveText('Tell us about your family');
  }

  /** STEP 1 Questions **/

  /**
   * Question: Your Title
   * <br> Type: Select
   * @returns {Select}
   */
  yourTitle(): Select {
    return new Select(this.page, { label: 'Your Title' });
  }

  /**
   * Question: The patient is [select from list] *
   * <br> Type: Select
   * @returns {Select}
   */
  patientRelationship(): Select {
    return new Select(this.page, { label: 'The patient is [select from list]' });
  }

  /**
   * Question: State the family lives in *
   * <br> Type: Select
   * @returns {Select}
   */
  state(): Select {
    return new Select(this.page, { label: 'State the family lives in' });
  }

  /**
   * Question: Is there a website, blog, or social media page that you
   write or maintain that describes your family's undiagnosed suspected genetic
   condition?
   * <br> Type: Input
   * @returns {Input}
   */
  website(): Input {
    return new Input(this.page, { ddpTestID: 'answer:WEBSITE' });
  }

  /**
   * Question: Please describe the rare and undiagnosed
   suspected genetic condition present in the family and any relevant symptoms.
   * <br> Type: Textarea
   * @returns{TextArea}
   */
  describeGeneticCondition(): TextArea {
    return new TextArea(this.page, { ddpTestID: 'answer:DESCRIPTION' });
  }

  /**
   * Question: Your First Name
   * <br> Type: Input
   * @returns {Input}
   */
  yourFirstName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:FILLER_FIRST_NAME' });
  }

  /**
   * Question: Your Telephone Number
   * <br> Type: Input
   * @returns {Input}
   */
  phone(): Input {
    return new Input(this.page, { ddpTestID: 'answer:FILLER_PHONE' });
  }

  /**
   * Question: Confirm Your Telephone Number
   * <br> Type: Input
   * @returns {Input}
   */
  confirmPhone(): Input {
    return new Input(this.page, { ddpTestID: 'answer-confirmation:FILLER_PHONE' });
  }

  /**
   * Question: Have any clinical diagnoses been made?
   * <br> Type: Radiobutton list
   * @returns {Question}
   */
  haveAnyClinicalDiagnosesBeenMade(): Question {
    return new Question(this.page, { prompt: 'Have any clinical diagnoses been made?' });
  }

  /**
   * Clinical Diagnoses Details
   * <br> Answered 'Yes' to Question: 'Have any clinical diagnoses been made?'
   * <br> Type: TextArea
   */
  clinicalDiagnosesDetails(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CLINICAL_DIAGNOSES_DETAILS' });
  }

  /**
   * Question: Have any genetic diagnoses been made?
   * <br> Type: Radiobutton list
   * @returns {Question}
   */
  haveAnyGeneticDiagnosesBeenMade(): Question {
    return new Question(this.page, { prompt: 'Have any genetic diagnoses been made?' });
  }

  /**
   * GENETIC_DIAGNOSES_DETAILS
   * <br> Answered 'Yes' to Question 'Have any genetic diagnoses been made?'
   * <br> Type: Input
   */
  geneticDiagnosesDetails(): TextArea {
    return new TextArea(this.page, { ddpTestID: 'answer:GENETIC_DIAGNOSES_DETAILS' });
  }

  /**
   * Question: How did you find out about this project?
   * <br> Type: Checkbox list
   * @returns {Question}
   */
  howDidYouFindOutAboutThisProject(): Question {
    return new Question(this.page, { prompt: 'How did you find out about this project?' });
  }

  /** STEP 2 Questions **/

  /**
   * Question: Patient's Current Age
   * <br> Type: Input
   * @returns {Input}
   */
  patientAge(): Input {
    return new Input(this.page, { ddpTestID: 'answer:PATIENT_AGE' });
  }

  /**
   * Question: Patient's Age at Onset of Condition
   * <br> Type: Input
   * @returns {Input}
   */
  patientAgeAtOnsetCondition(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONDITION_AGE' });
  }

  /**
   * Question: Patient's Sex
   * <br> Type: Question
   * @returns {Question}
   */
  patientSex(): Question {
    return new Question(this.page, { prompt: "Patient's Sex" });
  }

  /**
   * Question: Patient's Race
   * <br> Type: Select
   * @returns {Select}
   */
  patientRace(): Question {
    return new Question(this.page, { prompt: "Patient's Race" });
  }

  /**
   * Question: Patient's Ethnicity
   * <br> Type: Radiobutton list
   * @returns {Radiobutton}
   */
  patientEthnicity(): Question {
    return new Question(this.page, { prompt: "Patient's Ethnicity" });
  }

  /**
   * Question: Please indicate types of doctors the patient has seen
   * <br> Type: Select
   * @returns {Select}
   */
  indicateTypesOfDoctors(): Question {
    return new Question(this.page, { prompt: 'Please indicate types of doctors the patient has seen' });
  }

  /**
   * Question: Please indicate if the patient has had any of the following tests.
   * <br> Type: Checkbox list
   * @returns Question
   */
  indicatePatientHadFollowingTest(): Question {
    return new Question(this.page, { prompt: 'Please indicate if the patient has had any of the following tests' });
  }

  /**
   * Question: Please indicate if any patient biopsies may be available.
   * <br> Type: Checkbox list
   * @returns Question
   */
  indicateAnyPatientBiopsiesAvailable(): Question {
    return new Question(this.page, { prompt: 'Please indicate if any patient biopsies may be available' });
  }

  /**
   * Question: Is the patient currently participating in other research studies with genetic evaluations?
   * <br> Type: Radiobutton list
   * @returns {Radiobutton}
   */
  isPatientParticipatingInResearchStudies(): Question {
    return new Question(this.page, {
      prompt: 'Is the patient currently participating in other research studies with genetic evaluations'
    });
  }

  /** Click "Next" button */
  async next(opts: { waitForNav?: boolean } = {}): Promise<void> {
    await this.page.locator('button', { hasText: 'chevron_right' }).click();
  }
}
