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
  private readonly title: string | RegExp;
  readonly downloadButton: Locator;

  constructor(page: Page, study: string|RegExp) {
    super(page);
    this.title = study;
    this.downloadButton = this.page.getByRole('button', { name: 'Download mailing list' })
  }

  public async waitForReady(): Promise<void> {
    await expect(this.page).toHaveTitle(this.title);
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
