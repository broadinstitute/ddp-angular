import { Locator, Page, expect } from '@playwright/test';
import DsmPageBase from './dsm-page-base';
import { KitsTable } from 'dsm/component/tables/kits-table';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { logInfo } from 'utils/log-utils';
import Modal from 'dsm/component/modal';
import { getDate, getDateMonthAbbreviated, offsetDaysFromDate } from 'utils/date-utils';
import { SamplesNavEnum } from 'dsm/component/navigation/enums/samplesNav-enum';
import Checkbox from 'dss/component/checkbox';
import { KitType, Label } from 'dsm/enums';

export default abstract class KitsPageBase extends DsmPageBase {
  protected abstract TABLE_HEADERS: string[];
  protected readonly kitsTable: KitsTable;
  private readonly sentColumnIndex = 5;
  private readonly receivedColumnIndex = 3;
  private readonly mfBarcodeIndex = 1;

  protected constructor(readonly page: Page) {
    super(page);
    this.kitsTable = new KitsTable(this.page);
  }

  public get getKitsTable(): KitsTable {
    return this.kitsTable;
  }

  public async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(async () => expect(await this.page.locator('mat-checkbox[id]').count()).toBeGreaterThanOrEqual(1)).toPass({ timeout: 60000 });
    const kits = await this.getStudyKitTypes()
    for (const kit of kits) {
      await expect(this.kitCheckbox(kit).toLocator()).toBeVisible();
    }
    await waitForNoSpinner(this.page);
  }

  public async reloadKitPage(kitType: KitType): Promise<void> {
    await this.reload();
    await this.waitForReady();
    await this.selectKitType(kitType);
  }

  public async reloadKitList(): Promise<void> {
    const waitPromise = waitForResponse(this.page, {uri: '/kitRequests'});
    await this.getReloadKitListBtn.click();
    await waitPromise;
    await waitForNoSpinner(this.page);
  }

  public async selectKitType(kitType: KitType, opts: { waitForResp?: string } = {}): Promise<boolean> {
    const { waitForResp = 'ui/kitRequests' } = opts;
    const waitPromise = waitForResp === 'undefined' ? Promise.resolve() : waitForResponse(this.page, { uri: waitForResp });
    await waitForNoSpinner(this.page);
    await Promise.all([
      waitPromise,
      this.kitCheckbox(kitType).check()
    ]);
    await waitForNoSpinner(this.page);
    return await this.hasKitRequests();
  }

  public async deactivateKitFor(opts: { shortId?: string, shippingId?: string } = {}): Promise<string> {
    let { shortId, shippingId } = opts;
    expect(shortId || shippingId).toBeTruthy(); // At least one param must be provided

    expect(await this.kitsTable.exists()).toBeTruthy();
    const kitsCount = await this.kitsTable.rowLocator().count();
    expect(kitsCount).toBeGreaterThanOrEqual(1);

    let rowIndex = 0;
    if (shortId) {
      await this.kitsTable.searchByColumn(Label.SHORT_ID, shortId, { column2Name: Label.SHIPPING_ID, value2: shippingId });
      expect(await this.kitsTable.rowLocator().count()).toBeGreaterThanOrEqual(1);
      const [actualShortId] = await this.kitsTable.getTextAt(rowIndex, Label.SHORT_ID);
      expect(actualShortId).toStrictEqual(shortId);
      [shippingId] = await this.kitsTable.getTextAt(rowIndex, Label.SHIPPING_ID);
    } else {
      // Selects a random Short ID
      rowIndex = await this.kitsTable.getRandomRowIndex();
      [shortId] = await this.kitsTable.getTextAt(rowIndex, Label.SHORT_ID);
      [shippingId] = await this.kitsTable.getTextAt(rowIndex, Label.SHIPPING_ID);
    }
    expect(shortId.length).toBeTruthy();
    expect(shippingId.length).toBeTruthy();

    await this.deactivate(rowIndex);
    logInfo(`Deactivated kit. Short ID: ${shortId}, Shipping ID: ${shippingId}`);
    return shippingId;
  }

  public async deactivateAllKitsFor(shortId?: string): Promise<void> {
    const hasKitRequests = await this.hasKitRequests();
    if (!hasKitRequests) {
      logInfo(`No kit requests available on the page`);
      return;
    }

    if (!shortId) {
      // Selects a random Short ID
      const rowIndex = await this.kitsTable.getRandomRowIndex();
      [shortId] = await this.kitsTable.getTextAt(rowIndex, Label.SHORT_ID);
    }
    expect(shortId.length).toBeTruthy();

    await this.kitsTable.searchByColumn(Label.SHORT_ID, shortId);
    await waitForNoSpinner(this.page);

    if (hasKitRequests) {
      const kitsCount = await this.kitsTable.rowLocator().count();
      for (let i = 0; i < kitsCount; i++) {
        await this.deactivate(i);
        await this.kitsTable.rows.count() && await this.deactivateAllKitsFor(shortId);
      }
    }

    await expect(this.kitsTable.rowLocator()).toHaveCount(0);
    const selectedKit = await this.getSelectedKitType();
    logInfo(`Deactivated all ${selectedKit} kits. Short ID: ${shortId}`);
  }

  public async hasKitRequests(): Promise<boolean> {
    const pageText = this.page.getByText('There are no kit requests');
    await Promise.race([
      expect(pageText).toBeVisible(),
      expect(this.kitsTable.tableLocator()).toBeVisible(),
    ]);
    const existsText = await pageText.isVisible();
    return !existsText;
  }

  public async getSelectedKitType(): Promise<KitType | null> {
    const kits = await this.getStudyKitTypes();
    for (const kit of kits) {
      const isSelected = await this.kitCheckbox(kit).isChecked();
      if (isSelected) {
        return kit;
      }
    }
    return null;
  }

  public async getStudyKitTypes(studyName?: StudyEnum): Promise<KitType[]> {
    if (!studyName) {
      const studyNameLocation = this.page.locator(`//app-navigation//a[@data-toggle='dropdown']//i`);
      studyName = await studyNameLocation.innerText() as StudyEnum;
    }
    // Most studies have Blood and Saliva kits; RGP has Blood and 'Blood & RNA' kits; Pancan has Blood, Saliva, and Stool kits
    let kitTypes;
    switch (studyName) {
      case StudyEnum.RGP:
        kitTypes = [KitType.BLOOD, KitType.BLOOD_AND_RNA];
        break;
      case StudyEnum.PANCAN:
        kitTypes = [KitType.BLOOD, KitType.SALIVA, KitType.STOOL];
        break;
      default:
        kitTypes = [KitType.SALIVA, KitType.BLOOD];
        break;
    }
    return kitTypes;
  }

  private async deactivate(row = 0): Promise<string> {
    const deactivateButton = this.kitsTable.deactivateButtons.nth(row);
    await deactivateButton.click();

    await expect(this.deactivateReasonInput).toBeVisible();
    await expect(this.deactivateReasonBtn).toBeVisible();

    const reason = `testDeactivate-${new Date().getTime()}`;
    await this.deactivateReasonInput.fill(reason);
    await Promise.all([
      waitForResponse(this.page, {uri: '/deactivateKit'}),
      waitForResponse(this.page, {uri: '/kitRequests'}),
      this.deactivateReasonBtn.click(),
    ]);

    await expect(new Modal(this.page).toLocator()).not.toBeVisible();
    await waitForNoSpinner(this.page);
    return reason;
  }

  /**
 * Sorts the given column by clicking on it.
 * Date type columns - first click gives you list starting with dates from long ago; second click starts with recent dates
 * @param columnName name of the column to be sorted
 */
  public async sortColumnByDate(opts: {
    columnName: Label,
    startWithRecentDates: boolean}): Promise<void> {
    const { columnName, startWithRecentDates = true } = opts;

    const column = columnName as string;
    const columnSorter = this.page.locator(`//table//th[contains(.,'${column}')]/mfdefaultsorter`);
    expect(columnSorter, `The column ${column} is not able to be sorted in the ${this.PAGE_TITLE} page`).toBeTruthy();

    if (!startWithRecentDates) {
      //Only a single click is needed
      await columnSorter.click();
    } else if (startWithRecentDates) {
      //Two clicks are needed to get the wanted result
      await columnSorter.click();
      await columnSorter.click();
    }
  }

  /**
   * Sorts the given column by clicking on it.
   * String type columns - first click gives you A -> Z list; second click gives you Z -> A list
   * @param columnName name of the column to be sorted
   */
  public async sortColumnAlphabetically(opts: {columnName: Label, aToZ: boolean}): Promise<void> {
    const { columnName, aToZ = true } = opts;

    const column = columnName as string;
    const columnSorter = this.page.locator(`//table//th[contains(.,'${column}')]/mfdefaultsorter`);
    expect(columnSorter, `The column ${column} is not able to be sorted in the ${this.PAGE_TITLE} page`).toBeTruthy();

    if (aToZ) {
      //Only a single click is needed
      await columnSorter.click();
    }

    if (!aToZ) {
      //Two clicks are needed to get the wanted result
      await columnSorter.click();
      await columnSorter.click();
    }
  }

  /**
   * Gets the mf barcodes for kits that were sent or received since the given date
   * @param sinceDay The earliest date to search for kits
   * @param currentPage The current page being checked
   * @returns Array of locators that have the mf barcode
   */
  public async getMFBarcodesSince(sinceDay: string, currentPage: SamplesNavEnum.SENT | SamplesNavEnum.RECEIVED):Promise<Locator[]> {
    const today = getDate();
    let currentDay = (new Date()).getTime(); //Get today's date in milliseconds for comparison
    const earliestDate = (new Date(sinceDay)).getTime(); //Get earliest requested date in milliseconds for comparison
    let currentDayFormatted = getDateMonthAbbreviated(today);
    const sinceDateFormatted = getDateMonthAbbreviated(sinceDay);
    logInfo(`Earliest date of expected kit: ${sinceDateFormatted}`);
    logInfo(`Today: ${currentDayFormatted}`);
    let allRelevantKits: Locator[] = [];

    while (currentDay >= earliestDate) {
      const mfBarcodeLocator = this.getMFBarcodeLocatorString(currentPage, currentDayFormatted);
      const batchOfKits = await this.page.locator(mfBarcodeLocator).all();
      logInfo(`Amount of kits from ${currentDayFormatted}: ${batchOfKits.length}`);
      allRelevantKits = allRelevantKits.concat(batchOfKits);
      logInfo(`Current amount of recent kits: ${allRelevantKits.length}`);
      const currentDayInDateFormat = new Date(currentDayFormatted);
      const previousDay = getDate(offsetDaysFromDate(currentDayInDateFormat, 1, { isAdd: false }));
      currentDayFormatted = getDateMonthAbbreviated(previousDay);
      currentDay = (new Date(currentDayFormatted)).getTime();
    }
    expect(allRelevantKits, `No kits have been sent out between ${sinceDay} and ${today}`).toBeTruthy();
    logInfo(`Total amount of recent kits: ${allRelevantKits.length}`);
    return allRelevantKits;
  }

  private getMFBarcodeLocatorString(
    currentPage: SamplesNavEnum.SENT | SamplesNavEnum.RECEIVED,
    day: string): string {
    let result = '';
    switch (currentPage) {
      case SamplesNavEnum.SENT:
        result = `//table//td[${this.sentColumnIndex}][contains(.,'${day}')]/following-sibling::td[${this.mfBarcodeIndex}]`;
        break;
      case SamplesNavEnum.RECEIVED:
        result = `//table//td[${this.receivedColumnIndex}][contains(.,'${day}')]/following-sibling::td[${this.mfBarcodeIndex}]`;
        break;
      default:
        break;
    }
    return result;
  }

  public get deactivateReasonInput(): Locator {
    return this.page.locator("//app-modal/div[@class='modal fade in']//table/tr"
      + "[td[1][text()[normalize-space()='Reason:']]]/td[2]/mat-form-field//input");
  }

  public get deactivateReasonBtn(): Locator {
    return this.page.locator('//app-modal/div[@class="modal fade in"]'
      + '//div[@class="app-modal-footer"]/button[text()[normalize-space()="Deactivate"]]');
  }

  public get getReloadKitListBtn(): Locator {
    return this.page.getByRole('button', {name: 'Reload Kit List'});
  }

  public kitCheckbox(kitType: KitType): Checkbox {
    return new Checkbox(this.page, { label: kitType, root: 'app-root' });
  }
}
