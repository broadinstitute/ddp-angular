import { expect, Page } from '@playwright/test';
import Table from 'dss/component/table';
import { LmsPageBase } from 'dss/pages/lms/lms-page-base';

export default class LmsDashboardPage extends LmsPageBase {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await expect(this.page.locator('h1.dashboard-title-section__title')).toContainText('Participant Dashboard');
    await expect(this.getTable().tableLocator()).toBeVisible();
  }

  getTable(): Table {
    return new Table(this.page, { ddpTestID: 'activitiesTable' });
  }
}
