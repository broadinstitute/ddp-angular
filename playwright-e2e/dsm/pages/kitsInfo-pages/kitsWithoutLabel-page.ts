import {expect, Locator, Page} from '@playwright/test';
import {KitType} from 'dsm/component/kitType/kitType';
import {KitTypeEnum} from 'dsm/component/kitType/enums/kitType-enum';
import {waitForNoSpinner, waitForResponse} from 'utils/test-utils';
import {KitsTable} from 'dsm/component/tables/kits-table';
import {KitsColumnsEnum} from 'dsm/pages/kitsInfo-pages/enums/kitsColumns-enum';
import {assertTableHeaders} from 'utils/assertion-helper';
import {rows} from 'lib/component/dsm/paginators/types/rowsPerPage';


export default class KitsWithoutLabelPage {
  private readonly PAGE_TITLE = 'Kits without label';
  private readonly TABLE_HEADERS = [KitsColumnsEnum.PRINT_KIT, KitsColumnsEnum.SHORT_ID,
    KitsColumnsEnum.PREFERRED_LANGUAGE, KitsColumnsEnum.SHIPPING_ID,
    KitsColumnsEnum.DDP_REALM, KitsColumnsEnum.TYPE, ''];
  // the last item is empty string because the deactivate buttons columns doesn't have one

  private readonly expectedKitTypes = [KitTypeEnum.SALIVA, KitTypeEnum.BLOOD];

  private readonly kitType = new KitType(this.page);
  private readonly kitsTable = new KitsTable(this.page);

  constructor(private readonly page: Page) {}

  public get kitsWithoutLabelTable(): KitsTable {
    return this.kitsTable;
  }

  public get kitTypeCheckbox(): KitType {
    return this.kitType;
  }

  public async goToPage(page: number): Promise<void> {
    await this.kitsTable.goToPage(page);
  }

  public async rowsPerPage(rows: rows): Promise<void> {
    await this.kitsTable.rowsPerPage(rows);
  }

  public async waitForReady(kitTypes?: KitTypeEnum[]): Promise<void> {
    const knownKitTypes = kitTypes ?? this.expectedKitTypes; //Use the param kit types if provided, if they are not, then use the general expected kit types
    await Promise.all([
      this.page.waitForLoadState(),
      this.assertPageTitle()
    ]);
    await expect(async () => expect(await this.page.locator('mat-checkbox[id]').count()).toBeGreaterThanOrEqual(1))
      .toPass({ timeout: 60000 });
    await this.assertDisplayedKitTypes(knownKitTypes);
  }

  public async assertDisplayedKitTypes(kitTypes: KitTypeEnum[]): Promise<void> {
    await waitForNoSpinner(this.page);
    for (const kitType of kitTypes) {
      await expect(this.kitType.displayedKitType(kitType),
        'Kit without Labels page - Displayed kit types checkboxes are wrong').toBeVisible()
    }
  }

  public async selectKitType(kitType: KitTypeEnum): Promise<void> {
    await waitForNoSpinner(this.page);
    await Promise.all([
      waitForResponse(this.page, { uri: 'ui/kitRequests' }),
      this.kitType.selectKitType(kitType)
    ]);
    await waitForNoSpinner(this.page);
  }

  public async deactivateAllKitsFor(shortId: string) {
    await this.kitsTable.searchBy(KitsColumnsEnum.SHORT_ID, shortId);
    await waitForNoSpinner(this.page);
    const kitsCount = await this.kitsTable.rows.count();
    if (kitsCount) {
      await this.deactivateKit(this.kitsTable.deactivateButtons.nth(0));
      await this.kitsTable.rows.count() && await this.deactivateAllKitsFor(shortId)
    }
    await expect(this.kitsTable.rows,
      'Kits Without Label page - All kits were not removed')
      .toHaveCount(0)
  }

  public async search(columnName: KitsColumnsEnum, value: string): Promise<void> {
    await this.kitsTable.searchBy(columnName, value);
  }

  public async getData(columnName: KitsColumnsEnum): Promise<string> {
    return await this.kitsTable.getData(columnName);
  }

  private async deactivateKit(deactivateButton: Locator): Promise<void> {
    await deactivateButton.click();
    const deactivateReasonInput = this.page.locator(this.deactivateReasonInputXPath);
    const deactivateReasonButton = this.page.locator(this.deactivateReasonBtnXPath);

    await expect(deactivateReasonInput,
      'Kits Without Label page - Deactivate reason input field is not visible')
      .toBeVisible();
    await expect(deactivateReasonButton,
      'Kits Without Label page - Deactivate reason button is not visible')
      .toBeVisible();

    await deactivateReasonInput.fill(`testDeactivate-${new Date().getTime()}`);
    await deactivateReasonButton.click();

    await waitForResponse(this.page, {uri: '/deactivateKit'});
    await waitForNoSpinner(this.page);
    await waitForResponse(this.page, {uri: '/kitRequests'});
  }

  /* Assertions */
  public async assertPageTitle(): Promise<void> {
    await expect(this.page.locator('h1'),
      "Kits Without Label page - page title doesn't match the expected one")
      .toHaveText(this.PAGE_TITLE);
  }

  public async assertReloadKitListBtn(): Promise<void> {
    await expect(this.page.locator(this.reloadKitListBtnXPath),
      'Kits Without Label page - Reload Kit List Button is not visible').toBeVisible();
  }

  public async assertCreateLabelsBtn(): Promise<void> {
    await expect(this.page.locator(this.createLabelsBtnXPath),
      'Kits Without Label page - Create Labels button is not visible')
      .toBeVisible();
  }

  public async assertTableHeader(): Promise<void> {
    assertTableHeaders(await this.kitsTable.getHeaderTexts(), this.TABLE_HEADERS);
  }

  public get createLabelsButton(): Locator {
    return this.page.locator(this.createLabelsBtnXPath);
  }

  /* XPaths */
  private get deactivateReasonInputXPath(): string {
    return "//app-modal/div[@class='modal fade in']//table/tr"
      + "[td[1][text()[normalize-space()='Reason:']]]/td[2]/mat-form-field//input";
  }

  private get deactivateReasonBtnXPath(): string {
    return "//app-modal/div[@class='modal fade in']"
      + "//div[@class='app-modal-footer']/button[text()[normalize-space()='Deactivate']]";
  }

  public get reloadKitListBtnXPath(): string {
    return '//button[normalize-space()="Reload Kit List"]';
  }

  public get createLabelsBtnXPath(): string {
    return '//button[normalize-space()="Create Labels"]';
  }
}
