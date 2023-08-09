import { expect, Page } from '@playwright/test';
import Table from 'dss/component/table';
import { AtcpPageBase } from 'dss/pages/atcp/atcp-page-base';
import { waitForNoSpinner } from 'utils/test-utils';

export default class AtcpDashboardPage extends AtcpPageBase {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await Promise.all([
      expect(this.page).toHaveURL(/\/dashboard/),
      expect(this.page.locator('h1.title')).toHaveText('Thank you for joining the Global A-T Family Data Platform!'),
    ])
    await waitForNoSpinner(this.page);
    await this.getTable().waitForReady();
  }

  getTable(): Table {
    return new Table(this.page, { cssClassAttribute: '.user-activities-table' });
  }
}
