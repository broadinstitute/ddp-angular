import { expect, Page } from '@playwright/test';
import { AngioPageBase } from 'pages/angio/angio-page-base';
import Table from 'lib/component/table';

export default class DashboardPage extends AngioPageBase {
  constructor(page: Page) {
    super(page);
  }

  getDashboardTable(): Table {
    return new Table(this.page, { ddpTestID: 'activitiesTable' });
  }

  async waitForReady(): Promise<void> {
    await this.page.waitForURL('**/dashboard');
    await expect(this.page.locator('.PageContent-subtitle')).toHaveText('My Dashboard');
    await expect(this.getDashboardTable().headerLocator()).toHaveCount(5);
  }
}
