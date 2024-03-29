import { Download, expect, Locator, Page } from '@playwright/test';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import { Label } from 'dsm/enums';
import Input from 'dss/component/input';
import { FillDate } from 'dsm/component/models/tissue-inputs-interface';
import DatePicker from 'dsm/component/date-picker';
import Checkbox from 'dss/component/checkbox';
import Select from 'dss/component/select';
import { logInfo } from 'utils/log-utils';
import tablistPageBase from 'dsm/pages/tablist-pages/tablist-page-base';

export interface PDFType {
  IRB_LETTER: string;
  RELEASE: string;
  RELEASE_PEDIATRIC: string;
  COVER: string;
  CONSENT_ASSENT: string;
  CONSENT: string;
  SOMATIC_CONSENT_ADDENDUM: string;
  SOMATIC_CONSENT_ADDENDUM_PEDIATRIC: string;
  SOMATIC_CONSENT_ASSENT_ADDENDUM_PEDIATRIC: string;
}

export const PDFName: PDFType = {
  IRB_LETTER: 'IRB Letter',
  RELEASE: 'release pdf',
  RELEASE_PEDIATRIC: 'pediatric release pdf',
  COVER: 'Cover PDF',
  CONSENT_ASSENT: 'parental consent & assent pdf',
  CONSENT: 'consent pdf v2',
  SOMATIC_CONSENT_ADDENDUM: 'somatic consent addendum pdf',
  SOMATIC_CONSENT_ADDENDUM_PEDIATRIC: 'somatic consent addendum pediatric pdf',
  SOMATIC_CONSENT_ASSENT_ADDENDUM_PEDIATRIC: 'somatic consent assent addendum pediatric pdf',
};


export default class MedicalRecordsRequestPage extends tablistPageBase {
  PAGE_TITLE = 'Medical Records - Request Page';

  constructor(page: Page) {
    super(page);
  }

  get toLocator(): Locator {
    return this.page.locator('//app-medical-record');
  }

  public async getStaticText(infoFieldName: Label): Promise<string> {
    const fieldLocator = this.staticField(infoFieldName);
    await expect(fieldLocator, `Field: ${infoFieldName} not found.`).toBeVisible();
    const data = await fieldLocator.textContent();
    return data?.trim() as string;
  }

  public async fillText(infoFieldName: Label, value: string): Promise<void> {
    const fieldLocator = this.dynamicField(infoFieldName);
    const input = new Input(this.page, { root: fieldLocator, });
    await expect(input.toLocator(), `Field: ${infoFieldName} is not visible.`).toBeVisible();
    expect(await input.isDisabled(), `Field: ${infoFieldName} is not editable.`).toBeFalsy();

    const existingValue = await input.currentValue();
    if (existingValue !== value) {
      const respPromise = waitForResponse(this.page, { uri: 'patch' });
      await input.fill(value, { overwrite: true });
      await input.blur();
      await respPromise;
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
    };

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
    return this.dynamicField(Label.INITIAL_MR_REQUEST).locator('app-field-datepicker');
  }

  public get initialMRReceivedDateLocator(): Locator {
    return this.dynamicField(Label.INITIAL_MR_RECEIVED).locator('app-field-datepicker');
  }

  /* Locators */

  public get getNoActionNeeded(): Checkbox {
    return new Checkbox(this.page, { root: this.dynamicField(Label.NO_ACTION_NEEDED)});
  }

  public async downloadPDFBundle(): Promise<Download> {
    const timeout = 2 * 60 * 1000;
    const [download] = await Promise.all([
      this.page.waitForEvent('download', { timeout }),
      this.downloadPDFBundleButton.click(),
    ]);
    await waitForNoSpinner(this.page);
    await expect(this.page.getByText(/Download finished/)).toBeVisible();

    const fileName = download.suggestedFilename();
    logInfo(`Download PDF Bundle finished: ${fileName}`);
    return download;
  }

  public async downloadSinglePDF(pdf: string, opts: { nth?: number } = {}): Promise<Download> {
    const { nth } = opts;
    const select = new Select(this.page, { selector: '//mat-select[@placeholder="Select PDF"]', root: this.toLocator });
    await expect(select.toLocator()).toBeVisible();
    await expect(this.downloadPDFBundleButton).toBeVisible();

    const doDownload = async (): Promise<Download> => {
      const timeout = 2 * 60 * 1000;
      const waitPromise = this.page.waitForEvent('download', { timeout });
      await select.selectOption(pdf, { nth });
      await this.downloadSelectedPDFButton.click();
      const download = await waitPromise;
      return download;
    };

    let download: Download;
    try {
      download = await doDownload();
    } catch (err) {
      // retry
      const appError = this.page.locator('app-error-snackbar').first();
      if (await appError.isVisible()) {
        const content = await appError.locator('.snackbar-content').innerText();
        logInfo(`ERROR: Failed download PDF "${pdf}". ${content}`);
        await appError.locator('[mattooltip="Close"]').click();
        await this.page.locator('#message a').click();
      }
      download = await doDownload();
    }
    await waitForNoSpinner(this.page);
    await expect(this.page.getByText(/Download finished/)).toBeVisible();

    const fileName = download.suggestedFilename();
    logInfo(`Download PDF "${pdf}" finished: ${fileName}`);

    return download;
  }

  /* XPath and Locator */
  private get downloadPDFBundleButton(): Locator {
    return this.page.getByRole('button', { name: 'Download PDF Bundle' });
  }

  private get downloadSelectedPDFButton(): Locator {
    return this.page.getByRole('button', { name: 'Download selected single PDF' });
  }
}
