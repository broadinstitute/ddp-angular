import { expect, Page } from '@playwright/test';
import Table from 'dss/component/table';
import { AtcpPageBase } from 'dss/pages/atcp/atcp-page-base';

export default class AtcpDashboardPage extends AtcpPageBase {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(this.page.locator('h1.title')).toHaveText('Thank you for joining the Global A-T Family Data Platform!');
  }

  getTable(): Table {
    return new Table(this.page, { cssClassAttribute: '.user-activities-table' });
  }
}
