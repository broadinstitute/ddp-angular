import { expect, Locator, Page } from '@playwright/test';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import { MainInfoEnum } from 'dsm/pages/participant-page/enums/main-info-enum';
import Input from 'dss/component/input';
import { DynamicFieldsEnum } from 'dsm/pages/medical-records/medical-records-enums';
import { FillDate } from 'dsm/pages/tissue/interfaces/tissue-information-interfaces';
import DatePicker from 'dsm/component/date-picker';
import Checkbox from 'dss/component/checkbox';

export default class MedicalRecordsRequestPage {
  private readonly PAGE_TITLE = 'Medical Records - Request Page';

  constructor(private readonly page: Page) { }

  public async waitForReady(): Promise<void> {
    await this.assertPageTitle();
    await waitForNoSpinner(this.page);
  }

  public async backToPreviousPage(): Promise<void> {
    await this.page.getByText('<< back to previous page').click();
    await this.page.waitForLoadState('load');
    await waitForNoSpinner(this.page);
  }

  public async backToParticipantList(): Promise<void> {
    await this.page.getByText("<< back to 'Participant List'").click();
    await this.page.waitForLoadState('load');
    await waitForNoSpinner(this.page);
  }

  public async getStaticText(infoFieldName: MainInfoEnum): Promise<string> {
    const fieldLocator = this.staticInformationXpath(infoFieldName);
    await expect(fieldLocator, `Field: ${infoFieldName} not found.`).toBeVisible();
    const data = await fieldLocator.textContent();
    return data?.trim() as string;
  }

  public async fillText(infoFieldName: DynamicFieldsEnum, value: string): Promise<void> {
    const fieldLocator = this.dynamicInformationXpath(infoFieldName);
    const input = new Input(this.page, { root: fieldLocator, });
    await expect(input.toLocator(), `Field: ${infoFieldName} is not visible.`).toBeVisible();
    expect(await input.isDisabled(), `Field: ${infoFieldName} is not editable.`).toBeFalsy();

    const existingValue = await input.currentValue();
    if (existingValue !== value) {
      await Promise.all([
        waitForResponse(this.page, { uri: 'patch' }),
        input.fill(value),
        input.blur()
      ]);
    }
  }

  public async fillInitialMRRequestDates(opts: { date1?: FillDate, date2?: FillDate, date3?: FillDate } = {}): Promise<void> {
    const { date1, date2, date3 } = opts;

    const helper = async (index: number, date: FillDate): Promise<void> => {
      const { date: selectDate, today } = date;
      const locator = this.initialMRRequestDateLocator.nth(index);
      await expect(locator).toBeVisible();
      const datePicker = new DatePicker(this.page, { nth: index, root: locator });
      if (selectDate) {
        const { yyyy, month, dayOfMonth } = selectDate;
        await datePicker.pickDate({ isToday: today, yyyy, month, dayOfMonth });
      } else {
        await datePicker.pickDate({ isToday: today });
      }
    }

    date1 && await helper(0, date1);
    date2 && await helper(1, date2);
    date3 && await helper(2, date3);
  }

  public async fillInitialMRReceivedDates(fillDate: FillDate): Promise<void> {
    const { date: selectDate, today } = fillDate;

    const locator = this.initialMRReceivedDateLocator.nth(0);
    await expect(locator).toBeVisible();
    const datePicker = new DatePicker(this.page, { root: locator });

    if (selectDate) {
        const { yyyy, month, dayOfMonth } = selectDate;
        await datePicker.pickDate({ isToday: today, yyyy, month, dayOfMonth });
      } else {
        await datePicker.pickDate({ isToday: today });
      }
  }

  public async getInitialMRRequestDate(dateIndex = 0): Promise<string> {
    const locator = this.initialMRRequestDateLocator.nth(dateIndex);
    await expect(locator, `Inital MR Request date is not visible at index: ${dateIndex}`).toBeVisible();
    const inputField = new Input(this.page, { root: locator });
    return inputField.currentValue();
  }

  public get initialMRRequestDateLocator(): Locator {
    return this.dynamicInformationXpath(DynamicFieldsEnum.INITIAL_MR_REQUEST).locator('app-field-datepicker');
  }

  public get initialMRReceivedDateLocator(): Locator {
    return this.dynamicInformationXpath(DynamicFieldsEnum.INITIAL_MR_RECEIVED).locator('app-field-datepicker');
  }

  /* Assertions */
  public async assertPageTitle(): Promise<void> {
    const pageTitle = await this.pageTitle.textContent();
    expect(pageTitle?.trim()).toEqual(this.PAGE_TITLE);
  }

  /* Locators */
  private get pageTitle(): Locator {
    return this.page.locator(`${this.pageXPath}/h1`);
  }

  public get getNoActionNeeded(): Checkbox {
    return new Checkbox(this.page, { root: this.dynamicInformationXpath(DynamicFieldsEnum.NO_ACTION_NEEDED)});
  }

  /* XPaths */
  private staticInformationXpath(infoFieldName: MainInfoEnum): Locator {
    return this.page.locator(`${this.staticInformationTableXPath}//tr[td[text()[normalize-space()="${infoFieldName}"]]]/td[2]`);
  }

  private get staticInformationTableXPath(): string {
    return `${this.pageXPath}//table[contains(@class, "table-condensed")]/tbody`;
  }

  private dynamicInformationXpath(infoFieldName: DynamicFieldsEnum, index = 2): Locator {
    return this.page.locator(`${this.dynamicInformationTableXPath}//tr[td[normalize-space()="${infoFieldName}"]]/td`);
  }

  private get dynamicInformationTableXPath(): string {
    return `${this.pageXPath}//div[last()]/table[not(contains(@class, "table"))]`;
  }

  private get pageXPath(): string {
    return '//app-medical-record';
  }
}
