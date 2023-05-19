import {expect, Locator, Page} from '@playwright/test';
import {KitType} from 'lib/component/dsm/kitType/kitType';
import {KitTypeEnum} from 'lib/component/dsm/kitType/enums/kitType-enum';
import {waitForNoSpinner, waitForResponse} from 'utils/test-utils';
import {KitsTable} from 'lib/component/dsm/tables/kitsTable';
import {KitsColumnsEnum} from './enums/kitsColumns-enum';
import {assertTableHeaders} from 'utils/assertion-helper';


export default class KitsWithoutLabelPage {
  private readonly PAGE_TITLE = 'Kits without label';
  private readonly TABLE_HEADERS = [KitsColumnsEnum.PRINT_KIT, KitsColumnsEnum.SHORT_ID,
    KitsColumnsEnum.PREFERRED_LANGUAGE, KitsColumnsEnum.SHIPPING_ID,
    KitsColumnsEnum.DDP_REALM, KitsColumnsEnum.TYPE, ''];
  // the last item is empty string because the deactivate buttons columns doesn't have one

  private readonly kitType = new KitType(this.page);
  private readonly kitsTable = new KitsTable(this.page);

  constructor(private readonly page: Page) {}

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

  public async deactivateAllKitsFor(shortId: string) {
    await this.kitsTable.searchBy(KitsColumnsEnum.SHORT_ID, shortId);
    await waitForNoSpinner(this.page);
    const kitsCount = await this.kitsTable.rows.count();
    if (kitsCount) {
      await this.deactivateKit(await this.kitsTable.deactivateButtons.nth(0));
      await this.kitsTable.rows.count() && await this.deactivateAllKitsFor(shortId)
    }
    await expect(await this.kitsTable.rows,
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

  /* XPaths */
  private get deactivateReasonInputXPath(): string {
    return "//app-modal/div[@class='modal fade in']//table/tr"
    + "[td[1][text()[normalize-space()='Reason:']]]/td[2]/mat-form-field//input"
  }

  private get deactivateReasonBtnXPath(): string {
    return "//app-modal/div[@class='modal fade in']"
      + "//div[@class='app-modal-footer']/button[text()[normalize-space()='Deactivate']]"
  }

  private get reloadKitListBtnXPath(): string {
    return "//button[span[text()[normalize-space()='Reload Kit List']]]"
  }

  private get createLabelsBtnXPath(): string {
    return "//button[span[text()[normalize-space()='Create Labels']]]"
  }
}
