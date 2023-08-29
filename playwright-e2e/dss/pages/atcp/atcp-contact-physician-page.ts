import { expect, Page } from '@playwright/test';
import Input from 'dss/component/input';
import Question from 'dss/component/Question';
import { AtcpPageBase } from 'dss/pages/atcp/atcp-page-base';

export default class AtcpContactPhysicianPage extends AtcpPageBase {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.page.locator('h1.activity-header')).toHaveText(/^Contacting Physician$/);
  }

  get physicianFirstName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:PHYSICIAN_FIRSTNAME' });
  }

  get physicianLastName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:PHYSICIAN_LASTNAME' });
  }

  get physicianMailingAddress(): Input {
    return new Input(this.page, { ddpTestID: 'answer:PHYSICIAN_MAIL' });
  }

  get physicianPhone(): Input {
    return new Input(this.page, { ddpTestID: 'answer:PHYSICIAN_PHONE' });
  }

  /**
   * <br> Question: <child_name> has been evaluated at (if applicable):
   *
   * <br> Type: Checkbox list
   */
  get evaluatedInstitution(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-EVALUATION'});
  }
}
