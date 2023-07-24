import { expect, Page } from '@playwright/test';
import Question from 'dss/component/Question';
import { AtcpPageBase } from 'dss/pages/atcp/atcp-page-base';
import { waitForNoSpinner } from 'utils/test-utils';

export default class AtcpJoinUsPage extends AtcpPageBase {
  constructor(page: Page) {
    super(page);
  }

  // Global A-T Family Data Platform | Activate Account Notification
  async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
    await expect(this.page).toHaveTitle('Global A-T Family Data Platform | Activate Account Notification');
    await expect(this.page.locator('h1.PageHeader-title')).toHaveText('Join Us');
  }

  get prequalSelfDescribe(): Question {
    return new Question(this.page, {cssClassAttribute: '.picklist-answer-PREQUAL_SELF_DESCRIBE' });
  }

  async clickJoinUs(): Promise<void> {
    await this.page.locator('button >> text="Join Us"').click();
  }
}
