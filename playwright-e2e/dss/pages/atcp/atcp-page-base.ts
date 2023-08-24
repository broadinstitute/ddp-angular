import { Page } from '@playwright/test';
import Button from 'dss/component/button';
import PageBase from 'dss/pages/page-base';

/**
 * Project ATCP base page.
 */
export abstract class AtcpPageBase extends PageBase {
  protected constructor(page: Page) {
    const { ATCP_BASE_URL } = process.env;
    if (!ATCP_BASE_URL) {
      throw Error(`Invalid ATCP base URL: process.env.ATCP_BASE_URL=${ATCP_BASE_URL}`);
    }
    super(page, ATCP_BASE_URL);
  }

  async saveAndSubmit(): Promise<void> {
    return new Button(this.page, { label: 'Save & Submit', root: '.activity-buttons' }).click();
  }

  async signAndConsent(): Promise<void> {
    return new Button(this.page, { label: 'Sign & Consent', root: '.activity-buttons' }).click();
  }

  async signAndAssent(): Promise<void> {
    return new Button(this.page, { label: 'Sign & Assent', root: '.activity-buttons' }).click();
  }
}
