import {Page} from '@playwright/test';
import {Kit} from './kit-enum';

export class KitType {
  constructor(private readonly page: Page) {}

  public async selectKitType(kitType: Kit): Promise<void> {
    await this.page.locator(this.checkboxXPath(kitType)).click();
  }

  /* XPaths */
  private checkboxXPath(kitType: Kit): string {
    return `//mat-checkbox[.//label/span[text()[normalize-space()='${kitType}']]]`;
  }
}
