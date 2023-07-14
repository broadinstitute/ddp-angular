import { expect, Page } from '@playwright/test';
import Button from 'dss/component/button';
import Question from 'dss/component/Question';
import { AtcpPageBase } from 'dss/pages/atcp/atcp-page-base';

export default class AtcpConsentPage extends AtcpPageBase {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.page.locator('app-workflow-progress .current .number')).toHaveText(/^2$/);
    await expect(this.page.locator('app-workflow-progress .current .name')).toHaveText('Consent');
  }

  /**
   * <br> Question: Study staff may re-contact me with follow-up research questionnaires and invitations to participate in additional studies.
   *                  I may choose to ignore these questionnaires/invitations.
   *
   * <br> Type: Radiobutton
   */
  get mayContactMeWithFollowupResearchQuestionnaires(): Question {
    return new Question(this.page, { cssClassAttribute: '.boolean-answer-RE_CONTACT_FOLLOW_UP'});
  }

  /**
   * <br> Question: Study staff may perform (or collaborate with others to perform) DNA sequencing on the saliva sample that
   *                  I will send them and store the sample until genomic sequencing is successfully completed.
   *
   * <br> Type: Radiobutton
   */
  get mayPerformDNASequencingOnSalivaSample(): Question {
    return new Question(this.page, { cssClassAttribute: '.boolean-answer-PERFORM_DNA'});
  }

  /**
   * <br> Question: Study staff may request my medical records from my physicians and hospitals.
   *
   * <br> Type: Radiobutton
   */
  get mayRequestMyMedicalRecords(): Question {
    return new Question(this.page, { cssClassAttribute: '.boolean-answer-MEDICAL_RECORDS'});
  }

  /**
   * <br> Question: Study staff may re-contact me in the event that it becomes possible to return genetic results to my physician or me.
   *
   * <br> Type: Radiobutton
   */
  get mayContactMeToReturnGeneticResults(): Question {
    return new Question(this.page, { cssClassAttribute: '.boolean-answer-RE_CONTACT_RETURN_RESULTS'});
  }

  /**
   * <br> Question: Study staff may contact my physician if a researcher reports genetic analysis results about my A-T mutations.
   *
   * <br> Type: Radiobutton
   */
  get mayContactMyPhysician(): Question {
    return new Question(this.page, { cssClassAttribute: '.boolean-answer-CONTACT_MY_PHYSICIAN'});
  }

  get participantDOB(): Question {
    return new Question(this.page, { prompt: 'DOB of Participant'});
  }

  get signAndConsent(): Button {
    return new Button(this.page, { label: 'Sign & Consent', root: '.activity-buttons' });
  }
}
