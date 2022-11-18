import { Page } from '@playwright/test';
import Table from 'lib/widget/table';
import { AngioPageBase } from 'pages/angio/angio-page-base';

export default class DashboardPage extends AngioPageBase {
  constructor(page: Page) {
    super(page);
  }

  // table.class not working for mat-table
  getDashboardTable(): Table {
    return new Table(this.page, { classAttribute: '[data-ddp-test="activitiesTable"]' });
  }

  waitForReady(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
