import {Page} from "@playwright/test";
import {KitTypes} from "./kitType-enum";

export class KitType {
  constructor(private readonly page: Page) {}

  public async selectKitType(kitType: KitTypes): Promise<void> {
    await this.page.locator(this.checkboxXPath(kitType)).click();
  }

  /* XPaths */
  private checkboxXPath(kitType: KitTypes): string {
    return `//mat-checkbox[.//label/span[text()[normalize-space()='${kitType}']]]`;
  }
}
