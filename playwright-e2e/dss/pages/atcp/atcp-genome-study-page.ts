import { expect, Page } from '@playwright/test';
import Question from 'dss/component/Question';
import { AtcpPageBase } from 'dss/pages/atcp/atcp-page-base';

export default class AtcpGenomeStudyPage extends AtcpPageBase {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.page.locator('app-workflow-progress .current .number')).toHaveText(/^5$/);
    await expect(this.page.locator('app-workflow-progress .current .name')).toHaveText('Genome Study');
  }

  /**
   * <br> Question: Please send me a saliva sample collection kit so I can provide a sample for whole genome sequencing.
   *
   * <br> Type: Checkbox
   */
  get sendMeSalivaSampleCollectionKit(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-COLLECTION_KIT'});
  }

  /**
   * <br> Question: Choose ethnicity...
   *
   * <br> Type: Checkbox
   */
  get chooseEthnicity(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-PARTICIPANT_ETHNICITY'});
  }
}
