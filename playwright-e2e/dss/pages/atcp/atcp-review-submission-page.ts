import { expect, Page } from '@playwright/test';
import Button from 'dss/component/button';
import { AtcpPageBase } from 'dss/pages/atcp/atcp-page-base';

export default class AtcpReviewSubmissionPage extends AtcpPageBase {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.page.locator('app-workflow-progress .current .number')).toHaveText(/^6$/);
    await expect(this.page.locator('app-workflow-progress .current .name')).toHaveText('Review & Submission');
  }

  async saveAndSubmitEnrollment(): Promise<void> {
    return new Button(this.page, { label: 'Save & Submit Enrollment', root: '.activity-buttons' }).click();
  }
}
