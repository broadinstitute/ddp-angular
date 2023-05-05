import {expect, Page} from '@playwright/test';
import {KitTypeEnum} from './enums/kitType-enum';

export class KitType {
  constructor(private readonly page: Page) {}

  public async selectKitType(kitType: KitTypeEnum): Promise<void> {
    await this.page.locator(this.kitTypeCheckbox(kitType)).click();
  }

  /* Assertions */
  public async verifyDisplayedKitTypes(kitTypes: KitTypeEnum[]): Promise<void> {
    for(let kitType of kitTypes) {
      await expect(this.page.locator(this.kitTypeCheckbox(kitType)),
        'Displayed kit types checkboxes are wrong').toBeVisible()
    }
  }

  /* XPaths */
  private kitTypeCheckbox(kitType: KitTypeEnum): string {
    return `//mat-checkbox[.//label/span[text()[normalize-space()='${kitType}']]]`;
  }
}
