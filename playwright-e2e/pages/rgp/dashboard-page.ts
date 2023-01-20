import { expect, Locator, Page } from '@playwright/test';
import Table from 'lib/widget/table';
import { RgpPageBase } from 'pages/rgp/rgp-page-base';
import { waitForNoSpinner } from 'utils/test-utils';

export default class DashboardPage extends RgpPageBase {
  private pageTitle: Locator;
  private userActivitiesTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.PageHeader-title');
    this.userActivitiesTitle = this.page.locator('h2.user-activities__title');
  }

  async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
    await expect(this.pageTitle).toBeVisible({ visible: true });
    await expect(this.pageTitle).toHaveText('Dashboard');
    await expect(this.userActivitiesTitle).toHaveText('Study Forms');
  }

  getDashboardTable(): Table {
    return new Table(this.page);
  }
}
