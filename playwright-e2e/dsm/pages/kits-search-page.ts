import { expect, Locator, Page } from '@playwright/test';
import DatePicker from 'dsm/component/date-picker';
import Select from 'dss/component/select';
import Table from 'dss/component/table';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import KitsPageBase from 'dsm/pages/kits-page-base';
import { Label } from 'dsm/enums';

export enum SearchByField {
  SHORT_ID = 'Short ID',
  TRACKING_NUMBER = 'Tracking Number (Blood kit return)',
  MANUFACTURE_BARCODE = 'Manufacturer Barcode'
}

export default class KitsSearchPage extends KitsPageBase {
  protected PAGE_TITLE = 'Kit Search';
  protected TABLE_HEADERS = [
    Label.DDP_REALM,
    Label.SHORT_ID,
    Label.COLLABORATOR_PARTICIPANT_ID,
    Label.COLLABORATOR_SAMPLE_ID,
    Label.SHIPPING_ID,
    Label.MF_CODE,
    Label.TYPE,
    Label.SENT,
    Label.RECEIVED,
    Label.COLLECTION_DATE
  ];

  constructor(page: Page) {
    super(page);
  }

  protected get rootLocator(): Locator {
    return this.page.locator('app-shipping-search');
  }

  public async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.searchByFieldSelect.toLocator()).toBeVisible();
  }

  async searchByField(searchField: SearchByField, value: string): Promise<Table> {
    await this.searchByFieldSelect.selectOption(searchField);
    const locator = this.page.locator('//div[button[normalize-space()="Search Kit"]]');
    await locator.locator('//input').fill(value);
    await Promise.all([
      waitForResponse(this.page, {uri: '/ui/searchKit'}),
      locator.locator('//button').click()
    ]);
    await waitForNoSpinner(this.page);

    const table = new Table(this.page);
    await table.waitForReady();
    return table
  }

  get searchByFieldSelect(): Select {
    return new Select(this.page, { label: 'Search by Field', root: 'app-shipping-search' });
  }

  async pickEndDate(opts: { yyyy?: number, month?: number, dayOfMonth?: number } = {}): Promise<string> {
    const { yyyy, month, dayOfMonth } = opts;
    return new DatePicker(this.page, { nth: 1 }).pickDate({ yyyy, month, dayOfMonth });
  }

  async getKitCollectionDate(opts: {rowIndex?: number}): Promise<string> {
    const { rowIndex = 1 } = opts;
    const collectionDateField = this.page.locator(`//app-field-datepicker//input[${rowIndex}]`);
    return (await collectionDateField.inputValue()).trim();
  }

  async setKitCollectionDate(opts: { dateField: Locator, collectionDate?: string, useTodayDate?: boolean }): Promise<void> {
    const { dateField, collectionDate = '', useTodayDate = true} = opts;
    //Input the date
    if (useTodayDate) {
      const todayButton = dateField.locator(`//ancestor::app-field-datepicker//button[normalize-space()='Today']`);
      await expect(todayButton).toBeVisible();
      await todayButton.click();
    } else {
      await dateField.pressSequentially(collectionDate);
    }
    //Save the date
    const saveDateButton = dateField.locator(`//ancestor::app-field-datepicker//button[normalize-space()='Save Date']`);
    await expect(saveDateButton).toBeVisible();
    await saveDateButton.click();
  }
}
