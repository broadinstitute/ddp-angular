import {expect, Page} from "@playwright/test";
import {KitType} from "../../lib/component/dsm/kitType/kitType";
import {KitTypes} from "../../lib/component/dsm/kitType/kitType-enum";
import {waitForNoSpinner} from "../../utils/test-utils";

export default class KitUploadPage {
  private readonly PAGE_TITLE = 'Kit Upload';
  private readonly kitType = new KitType(this.page);


  constructor(private readonly page: Page) {}

  public async selectKitType(kitType: KitTypes): Promise<void> {
    await this.waitForReady();
    await this.kitType.selectKitType(kitType);
  }

  public async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
  }

  /* Assertions */
  public async assertTitle() {
    await expect(this.page.locator('h1')).toHaveText(this.PAGE_TITLE);
  }
}
