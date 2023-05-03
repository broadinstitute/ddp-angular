import { Download, expect, Locator, Page } from '@playwright/test';
import Table from 'lib/component/table';

export const COLUMN = {
  EMAIL: 'Email',
  DATE_SIGNED_UP: 'Date signed up',
  FIRST_NAME: 'First Name',
  LAST_NAME: 'Last Name'
}

export default class MailingListPage {
  private readonly title: string | RegExp;
  readonly downloadButton: Locator;

  constructor(private readonly page: Page, study: string|RegExp) {
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
