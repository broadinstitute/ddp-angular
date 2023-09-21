import { expect, Page } from '@playwright/test';
import DatePicker from 'dsm/component/date-picker';
import Select from 'dss/component/select';
import Table from 'dss/component/table';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';

export enum SearchByField {
  SHORT_ID = 'Short ID',
  TRACKING_NUMBER = 'Tracking Number (Blood kit return)',
  MANUFACTURE_BARCODE = 'Manufacturer Barcode'
}

export default class SearchPage {
  constructor(private readonly page: Page) {}

  async waitForReady(): Promise<void> {
    await expect(this.page.locator('h1')).toHaveText('Kit Search');
  }

  async searchByField(searchField: SearchByField, value: string): Promise<Table> {
    const select = new Select(this.page, { label: 'Search by Field', root: 'app-shipping-search' });
    await select.selectOption(searchField);
    const locator = this.page.locator('//div[button[normalize-space()="Search Kit"]]');
    await locator.locator('//input').fill(value);
    await locator.locator('//button').click();
    await waitForResponse(this.page, {uri: '/ui/searchKit'});
    await waitForNoSpinner(this.page);

    const table = new Table(this.page);
    await table.waitForReady();
    return table
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
