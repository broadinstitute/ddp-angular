import {expect, Page} from "@playwright/test";
import {KitType} from "lib/component/dsm/kitType/kitType";
import {KitTypes} from "lib/component/dsm/kitType/kitType-enum";
import {waitForNoSpinner} from "../../utils/test-utils";
import {KitsTable} from "../../lib/component/dsm/tables/kitsTable";


export default class KitsWithoutLabelPage {
  private readonly PAGE_TITLE = 'Kits without label';
  private readonly kitType = new KitType(this.page);
  private readonly kitsTable = new KitsTable(this.page);

  constructor(private readonly page: Page) {}

  public async selectKitType(kitType: KitTypes): Promise<void> {
    await this.waitForReady();
    await this.kitType.selectKitType(kitType);
  }

  public async shippingId(shortId: string): Promise<string> {
    await this.kitsTable.searchBy('Short ID', shortId);
    await this.waitForReady();
    return this.kitsTable.shippingId(shortId);
  }

  public async reloadKitList(): Promise<void> {
    await this.waitForReady();
    await this.page.locator(this.realodKitButtonXPath).click();
  }

  public async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
  }

  /* Assertions */
  public async assertTitle() {
    await expect(this.page.locator('h1')).toHaveText(this.PAGE_TITLE);
  }

  /* XPaths */
  private get realodKitButtonXPath(): string {
    return '//button[./span[text()[normalize-space()=\'Reload Kit List\']]]';
  }



}
