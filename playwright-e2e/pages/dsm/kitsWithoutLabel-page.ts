import {expect, Locator, Page} from '@playwright/test';
import {KitType} from 'lib/component/dsm/kitType/kitType';
import {KitTypeEnum} from 'lib/component/dsm/kitType/enums/kitType-enum';
import {waitForNoSpinner, waitForResponse} from 'utils/test-utils';
import {KitsTable} from 'lib/component/dsm/tables/kitsTable';


export default class KitsWithoutLabelPage {
  private readonly PAGE_TITLE = 'Kits without label';
  private readonly kitType = new KitType(this.page);
  private readonly kitsTable = new KitsTable(this.page);

  constructor(private readonly page: Page) {}

  public async selectKitType(kitType: KitTypeEnum): Promise<void> {
    await waitForNoSpinner(this.page);
    await this.kitType.selectKitType(kitType);
    await waitForResponse(this.page, {uri: '/kitRequests'});
    await waitForNoSpinner(this.page);
  }

  public async deactivateAllKitsFor(shortId: string) {
    await this.kitsTable.searchBy('Short ID', shortId);
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

  public async shippingId(shortId: string): Promise<string> {
    await this.kitsTable.searchBy('Short ID', shortId);
    await waitForNoSpinner(this.page);
    return this.kitsTable.shippingId(shortId);
  }

  private async deactivateKit(deactivateButton: Locator): Promise<void> {
    await deactivateButton.click();
    const deactivateReasonInput = await this.page.locator(this.deactivateReasonInputXPath);
    const deactivateReasonButton = await this.page.locator(this.deactivateReasonBtnXPath);

    await expect(await deactivateReasonInput,
      'Kits Without Label page - Deactivate reason input field is not visible')
      .toBeVisible();
    await expect(await deactivateReasonButton,
      'Kits Without Label page - Deactivate reason button is not visible')
      .toBeVisible();

    await deactivateReasonInput.fill(`testDeactivate-${new Date().getTime()}`);
    await deactivateReasonButton.click();

    await waitForResponse(this.page, {uri: '/deactivateKit'});
    await waitForNoSpinner(this.page);
    await waitForResponse(this.page, {uri: '/kitRequests'});
  }

  /* Assertions */
  public async assertPageTitle() {
    await expect(this.page.locator('h1'),
      "Kits Without Label page - page title doesn't match the expected one")
      .toHaveText(this.PAGE_TITLE);
  }

  public async assertReloadKitListBtn() {
    await expect(this.page.locator(this.reloadKitListBtnXPath),
      'Kits Without Label page - Reload Kit List Button is not visible').toBeVisible();
  }

  public async assertCreateLabelsBtn() {
    await expect(this.page.locator(this.createLabelsBtnXPath),
      'Kits Without Label page - Create Labels button is not visible')
      .toBeVisible();
  }

  public async assertTableHeader() {
    expect(await this.kitsTable.header.screenshot(),
      "Kits Without Label page - Table header columns screenshot doesn't match the provided one")
      .toMatchSnapshot('kits_without_label_table_header.png');
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
