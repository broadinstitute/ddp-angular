import { expect, Page } from '@playwright/test';
import DatePicker from 'dsm/component/date-picker';

export default class KitsReportPage {
  constructor(private readonly page: Page) {}

  async waitForReady(): Promise<void> {
    await expect(this.page.locator('h1')).toHaveText('Report');
  }

  async pickStartDate(opts: { yyyy?: number, month?: number, dayOfMonth?: number } = {}): Promise<string> {
    const { yyyy, month, dayOfMonth } = opts;
    return new DatePicker(this.page, { nth: 0 }).pickDate({ yyyy, month, dayOfMonth });
  }

  async pickEndDate(opts: { yyyy?: number, month?: number, dayOfMonth?: number } = {}): Promise<string> {
    const { yyyy, month, dayOfMonth } = opts;
    return new DatePicker(this.page, { nth: 1 }).pickDate({ yyyy, month, dayOfMonth });
  }

  /**
   * Click Reload button
   * @returns {Promise<void>}
   */
  async reload(): Promise<void> {
    await this.page.locator('button', { hasText: 'Reload' }).click();
  }
}
