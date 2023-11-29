import {expect, Locator, Page} from '@playwright/test';
import {KitType} from 'dsm/component/kitType/kitType';
import {KitsTable} from 'dsm/component/tables/kits-table';
import {KitTypeEnum} from 'dsm/component/kitType/enums/kitType-enum';
import {waitForNoSpinner, waitForResponse} from 'utils/test-utils';
import {KitsColumnsEnum} from 'dsm/pages/kitsInfo-pages/enums/kitsColumns-enum';
import {assertTableHeaders} from 'utils/assertion-helper';
import {rows} from 'lib/component/dsm/paginators/types/rowsPerPage';
import { getDate, getDateMonthAbbreviated, offsetDaysFromDate, offsetDaysFromToday } from 'utils/date-utils';
import { logInfo } from 'utils/log-utils';
import { all } from 'axios';

export default class KitsSentPage {
  private readonly PAGE_TITLE = 'Kits Sent';
  private readonly TABLE_HEADERS = [KitsColumnsEnum.SHORT_ID, KitsColumnsEnum.SHIPPING_ID,
    KitsColumnsEnum.TRACKING_NUMBER, KitsColumnsEnum.TRACKING_RETURN,
    KitsColumnsEnum.SENT, KitsColumnsEnum.MF_CODE, KitsColumnsEnum.DDP_REALM,
    KitsColumnsEnum.TYPE, KitsColumnsEnum.SAMPLE_TYPE];

  private readonly kitType = new KitType(this.page);
  private readonly kitsTable = new KitsTable(this.page);
  private readonly sentColumnIndex = 5;
  private readonly mfBarcodeIndex = 1;

  constructor(private readonly page: Page) {
  }

  public async goToPage(page: number): Promise<void> {
    await this.kitsTable.goToPage(page);
  }

  public async rowsPerPage(rows: rows): Promise<void> {
    await this.kitsTable.rowsPerPage(rows);
  }

  public async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await waitForNoSpinner(this.page);
    await this.assertPageTitle();
  }

  public async selectKitType(kitType: KitTypeEnum): Promise<void> {
    await waitForNoSpinner(this.page);
    await this.kitType.selectKitType(kitType);
    await waitForResponse(this.page, {uri: '/kitRequests'});
    await waitForNoSpinner(this.page);
  }

  public async search(columnName: KitsColumnsEnum, value: string): Promise<void> {
    await this.kitsTable.searchBy(columnName, value);
  }

  public async getData(columnName: KitsColumnsEnum): Promise<string> {
    return await this.kitsTable.getData(columnName);
  }

  /**
   * Sorts the given column by clicking on it.
   * Date type columns - first click gives you list starting with dates from long ago; second click starts with recent dates
   * @param columnName name of the column to be sorted
   */
  public async sortColumnByDate(opts: {
    columnName: KitsColumnsEnum,
    startWithRecentDates: boolean}): Promise<void> {
    const { columnName, startWithRecentDates = true } = opts;

    const column = columnName as string;
    const columnSorter = this.page.locator(`//app-shipping//table//th[contains(.,'${column}')]/mfdefaultsorter`);
    expect(columnSorter, `The column ${column} is not able to be sorted in the Kits Sent page`).toBeTruthy();

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
  public async sortColumnAlphabetically(opts: {columnName: KitsColumnsEnum, aToZ: boolean}): Promise<void> {
    const { columnName, aToZ = true } = opts;

    const column = columnName as string;
    const columnSorter = this.page.locator(`//app-shipping//table//th[contains(.,'${column}')]/mfdefaultsorter`);
    expect(columnSorter, `The column ${column} is not able to be sorted in the Kits Sent page`).toBeTruthy();

    if (aToZ) {
      //Only a single click is needed
      await columnSorter.click();
    } else {
      //Two clicks are needed to get the wanted result
      await columnSorter.click();
      await columnSorter.click();
    }
  }

  public async getMFBarcodesSince(sinceDay: string): Promise<Locator[]> {
    const today = getDate();
    let currentDay = (new Date()).getTime(); //Get today's date in milliseconds for comparison
    const earliestDate = (new Date(sinceDay)).getTime(); //Get earliest requested date in milliseconds for comparison
    let currentDayFormatted = getDateMonthAbbreviated(today);
    const sinceDateFormatted = getDateMonthAbbreviated(sinceDay);
    logInfo(`Earliest date of expected kit: ${sinceDateFormatted}`);
    logInfo(`Today: ${currentDayFormatted}`);
    let allRelevantKits: Locator[] = [];

    while (currentDay >= earliestDate) {
      const batchOfKits = await this.page.
        locator(
          `//app-shipping//table//td[${this.sentColumnIndex}][contains(.,'${currentDayFormatted}')]/following-sibling::td[${this.mfBarcodeIndex}]`
        )
        .all();
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

  /* Assertions */
  public async assertPageTitle() {
    await expect(this.page.locator('h1'),
      'Kits Sent page - page title is wrong')
      .toHaveText(this.PAGE_TITLE);
  }

  public async assertReloadKitListBtn() {
    await expect(this.page.locator(this.reloadKitListBtnXPath),
      'Kits Sent page - Reload Kit List Button is not visible')
      .toBeVisible();
  }

  public async assertDisplayedKitTypes(kitTypes: KitTypeEnum[]): Promise<void> {
    await waitForNoSpinner(this.page);
    for (const kitType of kitTypes) {
      await expect(this.kitType.displayedKitType(kitType),
        'Kits Sent page - Displayed kit types checkboxes are wrong').toBeVisible()
    }
  }

  public async assertTableHeader(): Promise<void> {
    assertTableHeaders(await this.kitsTable.getHeaderTexts(), this.TABLE_HEADERS);
  }

  public async assertDisplayedRowsCount(count: number): Promise<void> {
    expect(await this.kitsTable.rows.count(),
      "Kits Sent page - displayed rows count doesn't match the provided one")
      .toBe(count)
  }

  /* XPaths */
  private get reloadKitListBtnXPath(): string {
    return "//button[span[text()[normalize-space()='Reload Kit List']]]"
  }
}
