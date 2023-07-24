import { expect, Page } from '@playwright/test';
import Button from 'dss/component/button';
import Input from 'dss/component/input';
import Question from 'dss/component/Question';
import { AtcpPageBase } from 'dss/pages/atcp/atcp-page-base';

export default class AtcpMedicalHistoryPage extends AtcpPageBase {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.page.locator('app-workflow-progress .current .number')).toHaveText(/^4$/);
    await expect(this.page.locator('app-workflow-progress .current .name')).toHaveText('Medical History');
  }

  /**
   * <br> Question: Has [Participant's First Name] been diagnosed with Ataxia-Telangiectasia (A-T)?
   *
   * <br> Type: Radiobutton
   */
  get hasDiagnosedWithAtaxiaTelangiectasia(): Question {
    return new Question(this.page, { prompt: 'been diagnosed with Ataxia-Telangiectasia (A-T)' });
  }

  /**
   * <br> Question: At what age was [Participant's First Name] diagnosed?
   *
   * <br> Type: Input
   */
  get diagnosedAgeYear(): Input {
    return new Input(this.page, { ddpTestID: 'answer:YEARS' });
  }

  /**
   * <br> Question: At what age was [Participant's First Name] diagnosed?
   *
   * <br> Type: Input
   */
  get diagnosedAgeMonth(): Input {
    return new Input(this.page, { ddpTestID: 'answer:MONTHS' });
  }

  /**
   * <br> Question: At what age was [Participant's First Name] first symptom observed (if applicable)?
   *
   * <br> Type: Input
   */
  get firstSymptomObservedAge(): Input {
    return new Input(this.page, { ddpTestID: 'answer:FIRST_SYMPTOM' });
  }

  /**
   * <br> Question: At what age was a neurologic problem first suspected (if applicable)?
   *
   * <br> Type: Input
   */
  get neurologicProblemFirstSuspectedAge(): Input {
    return new Input(this.page, { ddpTestID: 'answer:NEUROLOGIC_PROBLEM' });
  }

  /**
   * <br> Question: How was the diagnosis of A-T determined? Select all that apply.
   *
   * <br> Type: Checkbox
   */
  get howWasDiagnosisDetermined(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-DETERMINED' });
  }

  /**
   * <br> Question: If the exact ATM mutations have been determined, please provide:
   *
   * <br> Type: Input
   */
  get ATMMutations(): Input {
    return new Input(this.page, { ddpTestID: 'answer:ATM_MUTATIONS' });
  }

  /**
   * <br> Question: Who made the diagnosis?
   *
   * <br> Type: Input
   */
  get physicianMadeDiagnosis(): Input {
    return new Input(this.page, { ddpTestID: 'answer:NAME_PHYSICIAN' });
  }

  /**
   * <br> Question: Who made the diagnosis?
   *
   * <br> Type: Input
   */
  get physicianPhone(): Input {
    return new Input(this.page, { ddpTestID: 'answer:PHYSICIAN_TELEPHONE_NUMBER' });
  }

  /**
   * <br> Question: Where was the diagnosis made?
   *
   * <br> Type: Input
   */
  get physicianHospitalName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:HOSPITAL' });
  }

  /**
   * <br> Question: Where was the diagnosis made?
   *
   * <br> Type: Input
   */
  get physicianHospitalCity(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CITY' });
  }

  /**
   * <br> Question: Where was the diagnosis made?
   *
   * <br> Type: Input
   */
  get physicianHospitalState(): Input {
    return new Input(this.page, { ddpTestID: 'answer:STATE' });
  }

  /**
   * <br> Question: Where was the diagnosis made?
   *
   * <br> Type: Input
   */
  get physicianHospitalCountry(): Input {
    return new Input(this.page, { ddpTestID: 'answer:COUNTRY' });
  }

  /**
   * <br> Question: Does [Participant's First Name] have a history of cancer?
   *
   * <br> Type: Radiobutton
   */
  get haveHistoryOfCancer(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-HISTORY_OF_CANCER', exactMatch: true });
  }

  /**
   * <br> Question: Ambulation: Please select the most accurate description of [Participant's First Name]'s current ability to walk:
   *
   * <br> Type: Radiobutton
   */
  get descriptionOfAbilityToWalk(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-AMBULATION' });
  }

  /**
   * <br> Question: Symptoms or conditions associated with A-T:
   *    Please select all symptoms associated with A-T that [Participant's First Name] currently has or has had in the past:
   *
   * <br> Type: Checkbox
   */
  get symptomsOrConditionsAssociatedWithAT(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-SYMPTOMS_OR_CONDITIONS' });
  }

  /**
   * <br> Question: Telangiectasia (choose all that apply):
   *
   * <br> Type: Checkbox
   */
  get telangiectasia(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-TELANGIECTASIA' });
  }

  /**
   * <br> Question: Frequent infections (choose all that apply):
   *
   * <br> Type: Checkbox
   */
  get frequentInfections(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-FREQUENT_INFECTIONS' });
  }

  /**
   * <br> Question: Skin conditions (choose all that apply):
   *
   * <br> Type: Checkbox
   */
  get skinConditions(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-SKIN_CONDITIONS' });
  }

  /**
   * <br> Question: Other symptoms or conditions: Please select all other symptoms or conditions that the participant currently has or has had in the past
   *
   * <br> Type: Checkbox
   */
  get otherSymptomsOrConditions(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-OTHER_SYMPTOMS_OR_CONDITIONS' });
  }

  /**
   * <br> Question: Has [Participant's First Name] ever had any of the following infectious diseases? Select all that apply.
   *
   * <br> Type: Checkbox
   */
  get hadAnyInfectiousDiseases(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-INFECTIOUS_DISEASES' });
  }

  /**
   * <br> Question: Does [Participant's First Name] have immunodeficiency?
   *
   * <br> Type: Checkbox
   */
  get hasImmunodeficiency(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-IMMUNODEFICIENCY' });
  }

  /**
   * <br> Question: Has [Participant's First Name] ever acquired an infection from an immunization?
   *
   * <br> Type: Checkbox
   */
  get hasEverAcquiredInfectionFromImmunization(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-IMMUNIZATION' });
  }

  /**
   * <br> Question: Surgeries (Select all that apply):
   *
   * <br> Type: Checkbox
   */
  get surgeries(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-SURGERIES' });
  }

  /**
   * <br> Question: Medications: Has [Participant's First Name] ever taken any medications in the following categories?
   *                  (Please list all medications ever taken, not just current medications.)
   *
   * <br> Type: Input
   */
  get medicationName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:MEDICATION_NAME' });
  }

  /**
   * <br> Question: Medications: Has [Participant's First Name] ever taken any medications in the following categories?
   *                  (Please list all medications ever taken, not just current medications.)
   *
   * <br> Type: Input
   */
  get medicationBeganTakingAtAge(): Input {
    return new Input(this.page, { ddpTestID: 'answer:BEGAN_TAKING_AT_AGE' });
  }

  /**
   * <br> Question: Does [Participant's First Name] currently take any over-the-counter nutritional supplements?
   *
   * <br> Type: Radiobutton
   */
  get takeAnyOverTheCounterNutritionalSupplements(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-NUTRITIONAL_SUPPLEMENTS' });
  }

  /**
   * <br> Question: Are [Participant's First Name] parents consanguineous (closely related, for example: first cousins)?
   *
   * <br> Type: Radiobutton
   */
  get areParentsConsanguineous(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-CONSANGUINEOUS_PARENTS' });
  }

  /**
   * <br> Question: [Participant's First Name] Siblings
   *
   * <br> Type: Select
   */
  get siblingsSex(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-SEX_PICKLIST' });
  }

  /**
   * <br> Question: [Participant's First Name] Siblings
   *
   * <br> Type: Input
   */
  get siblingsAge(): Input {
    return new Input(this.page, { ddpTestID: 'answer:AGE' });
  }

  /**
   * <br> Question: [Participant's First Name] Siblings
   *
   * <br> Type: Select
   */
  get siblingsATDiagnosis(): Question {
    return new Question(this.page, {
      cssClassAttribute: '.picklist-answer-DIAGNOSIS_PICKLIST', parentSelector: this.page.locator('.ddp-answer-field')
    });
  }

  /**
   * <br> Question: [Participant's First Name] Siblings
   *
   * <br> Type: Select
   */
  get siblingsATCarrier(): Question {
    return new Question(this.page, {
      cssClassAttribute: '.picklist-answer-CARRIER_PICKLIST', parentSelector: this.page.locator('.ddp-answer-field')
    });
  }

  /**
   * <br> Question: Has [Participant's First Name] previously participated in any clinical drug trials related to A-T?
   *
   * <br> Type: Radiobutton
   */
  get hasPreviouslyParticipatedInAnyClinicalDrugTrials(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-PREVIOUSLY_PARTICIPATED' });
  }

  /**
   * <br> Question: Does [Participant's First Name] currently participate in any clinical drug trials related to A-T?
   *
   * <br> Type: Radiobutton
   */
  get isCurrentlyParticipateInAnyClinicalDrugTrials(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-currently_participate' });
  }

  /**
   * <br> Question: Has [Participant's First Name] previously donated a sample of blood, tissue, or other biospecimen for research?
   *
   * <br> Type: Radiobutton
   */
  get hasPreviouslyDonatedSampleOfBloodTissueOrBiospecimen(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-PREVIOUSLY_DONATED' });
  }

  async addAnotherMedication(): Promise<void> {
    await this.page.getByRole('button', { name: '+ Add Another Medication' }).click();
  }

  get startResume(): Button {
    return new Button(this.page, { label: 'Start/Resume', root: '.activity-buttons' });
  }
}
