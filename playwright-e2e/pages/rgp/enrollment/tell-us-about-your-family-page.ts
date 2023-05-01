import { expect, Locator, Page } from '@playwright/test';
import Question from 'lib/component/Question';
import Checkbox from 'lib/widget/checkbox';
import Input from 'lib/widget/input';
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
  indicateAnyFollowingTest(): Question {
    return new Question(this.page, { prompt: 'Please indicate if the patient has had any of the following tests' });
  }

  /**
   * Question: Please indicate if any patient biopsies may be available.
   * <br> Type: Checkbox list
   * @returns Question
   */
  indicateAnyBiopsiesAvailable(): Question {
    return new Question(this.page, { prompt: 'Please indicate if any patient biopsies may be available' });
  }

  /**
   * Question: Is the patient currently participating in other research studies with genetic evaluations?
   * <br> Type: Radiobutton list
   * @returns {Question}
   */
  isPatientParticipatingInOtherResearchStudies(): Question {
    return new Question(this.page, {
      prompt: 'Is the patient currently participating in other research studies with genetic evaluations'
    });
  }

  /** Step 3 questions */

  /**
   * Question: Patient's Biological Mother's Race
   * <br> Type: Select
   * @returns {Question}
   */
  patientBiologicalMotherRace(): Question {
    return new Question(this.page, {
      prompt: "Patient's Biological Mother's Race"
    });
  }

  /**
   * Question: Patient's Biological Mother's Ethnicity
   * <br> Type: Radiobutton list
   * @returns {Question}
   */
  patientBiologicalMotherEthnicity(): Question {
    return new Question(this.page, { prompt: "Patient's Biological Mother's Ethnicity" });
  }

  /**
   * Question: Does the patient's biological mother have the same genetic medical condition as the patient?
   * <br> Type: Radiobutton list
   * @returns {Question}
   */
  doesMotherHaveSameGeneticMedicalCondition(): Question {
    return new Question(this.page, {
      prompt: "Does the patient's biological mother have the same genetic medical condition as the patient"
    });
  }

  /**
   * Question: Is the patient's biological mother able to participate in the study?
   * <br> Type: Radiobutton list
   * @returns {Question}
   */
  isPatientBiologicalMotherAbleToParticipateStudy(): Question {
    return new Question(this.page, { prompt: "Is the patient's biological mother able to participate in the study?" });
  }

  /**
   * Question: Patient's Biological Father's Race
   * <br> Type: Select
   * @returns {Question}
   */
  patientBiologicalFatherRace(): Question {
    return new Question(this.page, {
      prompt: "Patient's Biological Father's Race"
    });
  }

  /**
   * Question: Patient's Biological Father's Ethnicity
   * <br> Type: Radiobutton list
   * @returns {Question}
   */
  patientBiologicalFatherEthnicity(): Question {
    return new Question(this.page, { prompt: "Patient's Biological Father's Ethnicity" });
  }

  /**
   * Question: Does the patient's biological father have the same genetic medical condition as the patient?
   * <br> Type: Radiobutton list
   * @returns {Question}
   */
  doesFatherHaveSameGeneticMedicalCondition(): Question {
    return new Question(this.page, {
      prompt: "Does the patient's biological father have the same genetic medical condition as the patient"
    });
  }

  /**
   * Question: Is the patient's biological father able to participate in the study?
   * <br> Type: Radiobutton list
   * @returns {Question}
   */
  isPatientBiologicalFatherAbleToParticipateStudy(): Question {
    return new Question(this.page, { prompt: "Is the patient's biological father able to participate in the study?" });
  }

  /**
   * Question: Patient doesn't have any siblings
   * <br> Type: Checkbox
   * @returns {Checkbox}
   */
  doesNotHaveAnySiblings(): Checkbox {
    return new Checkbox(this.page, { label: "Patient doesn't have any siblings" });
  }

  /**
   * Question: Patient's Biological Sibling Sex
   * <br> Type: Select
   * @returns {Question}
   */
  patientBiologicalSiblingSex(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-SIBLING_SEX' });
  }

  /**
   * Question: Patient's Biological Sibling Age
   * <br> Type: Select
   * @returns {Question}
   */
  patientBiologicalSiblingAge(): Input {
    return new Input(this.page, { ddpTestID: 'answer:SIBLING_AGE' });
  }

  /**
   * Question: Patient's Biological Sibling's Race
   * <br> Type: Select
   * @returns {Question}
   */
  patientBiologicalSiblingRace(): Question {
    return new Question(this.page, { prompt: "Patient's Biological Sibling's Race" });
  }

  /**
   * Question: Patient's Biological Sibling's Ethnicity
   * <br> Type: Radiobutton list
   * @returns {Question}
   */
  patientBiologicalSiblingEthnicity(): Question {
    return new Question(this.page, { prompt: "Patient's Biological Sibling's Ethnicity" });
  }

  /**
   * Question: Does the patient's biological sibling have the same genetic medical condition as the patient?
   * <br> Type: Radiobutton list
   * @returns {Question}
   */
  doesSiblingHaveSameGeneticMedicalCondition(): Question {
    return new Question(this.page, {
      prompt: "Does the patient's biological sibling have the same genetic medical condition as the patient"
    });
  }

  /**
   * Question: Is the patient's biological sibling able to participate in the study?
   * <br> Type: Radiobutton list
   * @returns {Question}
   */
  isPatientBiologicalSiblingAbleToParticipateStudy(): Question {
    return new Question(this.page, { prompt: "Is the patient's biological sibling able to participate in the study?" });
  }


  /**
   * Question: Patient doesn't have any children
   * <br> Type: Checkbox
   * @returns {Checkbox}
   */
  doesNotHaveAnyChildren(): Checkbox {
    return new Checkbox(this.page, { label: "Patient doesn't have any children" });
  }

  /**
   * Question: Patient doesn't have any other family members affected by the condition
   * <br> Type: Checkbox
   * @returns {Checkbox}
   */
  doesNotHaveAnyOtherFamilyMembersAffectedByCondition(): Checkbox {
    return new Checkbox(this.page, { label: "Patient doesn't have any other family members affected by the condition" });
  }

  /**
   * I agree that the information I entered here will be stored in a secure database and may be used to
   *   match me to a research study—the Rare Genomes Project.
   * <br> Type: Checkbox
   * @returns {Checkbox}
   */
  iAgreeToMatchToResearchStudy(): Checkbox {
    return new Checkbox(this.page, { label: 'I agree that the information I entered here will be stored in a secure database' });
  }

  /**
   * I agree that if the information that I entered is a match for the Rare Genomes Project now
   *   or in the future, I may be contacted about my possible participation.
   * <br> Type: Checkbox
   * @returns {Checkbox}
   */
  iAgreeToBeContacted(): Checkbox {
    return new Checkbox(this.page, { label: 'I agree that if the information that I entered is a match' });
  }

  /**
   * I understand that if I would like my information deleted from our database now or in the future,
   *   I can email raregenomes@broadinstitute.org and my information will be removed from the database.
   * <br> Type: Checkbox
   * @returns {Checkbox}
   */
  iUnderstand(): Checkbox {
    return new Checkbox(this.page, { label: 'I understand that if I would like my information deleted from our database now' });
  }

  /** Click "Next" button */
  async next(opts: { waitForNav?: boolean } = {}): Promise<void> {
    await this.page.locator('button', { hasText: 'chevron_right' }).click();
  }
}
