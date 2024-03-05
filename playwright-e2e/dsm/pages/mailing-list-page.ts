import { Download, expect, Locator, Page } from '@playwright/test';
import DsmPageBase from 'dsm/pages/dsm-page-base';
import Table from 'dss/component/table';

export const COLUMN = {
  EMAIL: 'Email',
  DATE: 'Date signed up',
  FIRST_NAME: 'First Name',
  LAST_NAME: 'Last Name'
}

export default class MailingListPage extends DsmPageBase {
  PAGE_TITLE = 'Mailing List';
  readonly downloadButton: Locator;

  constructor(page: Page) {
    super(page);
    this.downloadButton = this.page.getByRole('button', { name: 'Download mailing list' })
  }

  get toLocator(): Locator {
    return this.page.locator('app-mailing-list');
  }

  public async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.downloadButton).toBeVisible();
  }

  async getMailingListTable(): Promise<Table> {
    const table = new Table(this.page, {cssClassAttribute: '.table'});
    await table.waitForReady();
    return table;
  }

  async download(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadButton.click()
    ]);
    return download;
  }
}
