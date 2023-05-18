import {expect, Locator, Page} from '@playwright/test';
import {KitTypeEnum} from './enums/kitType-enum';

export class KitType {
  constructor(private readonly page: Page) {}

  public async selectKitType(kitType: KitTypeEnum): Promise<void> {
    await this.page.locator(this.kitTypeCheckbox(kitType)).click();
  }

  /* Locators */
  public displayedKitType(kitType: KitTypeEnum): Locator {
    return this.page.locator(this.kitTypeCheckbox(kitType));
  }

  /* XPaths */
  private kitTypeCheckbox(kitType: KitTypeEnum): string {
    return `//mat-checkbox[.//label/span[text()[normalize-space()='${kitType}']]]`;
  }
}
