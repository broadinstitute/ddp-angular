import {expect, Page} from '@playwright/test';
import {KitType} from 'lib/component/dsm/kitType/kitType';
import {KitsTable} from 'lib/component/dsm/tables/kitsTable';
import {KitTypeEnum} from 'lib/component/dsm/kitType/enums/kitType-enum';
import {waitForNoSpinner, waitForResponse} from 'utils/test-utils';
import {KitsColumnsEnum} from './enums/kitsColumns-enum';
import {assertTableHeaders} from 'utils/assertion-helper';

export default class KitsSentPage {
  private readonly PAGE_TITLE = 'Kits Sent';
  private readonly TABLE_HEADERS = [KitsColumnsEnum.SHORT_ID, KitsColumnsEnum.SHIPPING_ID,
    KitsColumnsEnum.TRACKING_NUMBER, KitsColumnsEnum.TRACKING_RETURN,
    KitsColumnsEnum.SENT, KitsColumnsEnum.MF_CODE, KitsColumnsEnum.DDP_REALM,
    KitsColumnsEnum.TYPE, KitsColumnsEnum.SAMPLE_TYPE];

  private readonly kitType = new KitType(this.page);
  private readonly kitsTable = new KitsTable(this.page);

  constructor(private readonly page: Page) {
  }

  public async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await waitForNoSpinner(this.page);
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
    await expect(await this.kitsTable.rows.count(),
      "Kits Sent page - displayed rows count doesn't match the provided one")
      .toEqual(count)
  }

  /* XPaths */
  private get reloadKitListBtnXPath(): string {
    return "//button[span[text()[normalize-space()='Reload Kit List']]]"
  }
}
