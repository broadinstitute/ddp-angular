import {expect, Page} from "@playwright/test";
import {KitType} from "lib/component/dsm/kitType/kitType";
import {KitsTable} from "lib/component/dsm/tables/kitsTable";
import {KitTypeEnum} from "lib/component/dsm/kitType/enums/kitType-enum";
import {waitForNoSpinner, waitForResponse} from "utils/test-utils";

export default class KitsSentPage {
  private readonly PAGE_TITLE = 'Kits Sent';
  private readonly kitType = new KitType(this.page);
  private readonly kitsTable = new KitsTable(this.page);

  constructor(private readonly page: Page) {
  }

  public async selectKitType(kitType: KitTypeEnum): Promise<void> {
    await waitForNoSpinner(this.page);
    await this.kitType.selectKitType(kitType);
    await waitForResponse(this.page, {uri: '/kitRequests'});
    await waitForNoSpinner(this.page);
  }

  public async searchByMFCode(MFCode: string): Promise<void> {
    await this.kitsTable.searchByMFCode(MFCode);
  }

  /* Assertions */
  public async assertPageTitle() {
    await expect(this.page.locator('h1'),
      "Kits Sent page - page title is wrong")
      .toHaveText(this.PAGE_TITLE);
  }

  public async assertReloadKitListBtn() {
    await expect(this.page.locator(this.reloadKitListBtnXPath),
      "Kits Sent page - Reload Kit List Button is not visible")
      .toBeVisible();
  }

  public async assertDisplayedKitTypes(kitTypes: KitTypeEnum[]): Promise<void> {
    await waitForResponse(this.page, {uri: '/kitTypes'});
    await waitForNoSpinner(this.page);
    for(let kitType of kitTypes) {
      await expect(this.kitType.displayedKitType(kitType),
        'Kits Sent page - Displayed kit types checkboxes are wrong').toBeVisible()
    }
  }

  public async assertTableHeader() {
    await expect(await this.kitsTable.header.screenshot(),
      "Kits Sent page - Table header columns screenshot doesn't match the provided one (Kits without label)")
      .toMatchSnapshot(`kits_sent_table_header.png`);
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
