import { Locator, Page } from '@playwright/test';

/**
 * Custom widget to work with "mat-select" element
 */
export default class Select {
  private readonly page: Page;
  private _locator: Locator;

  constructor(page: Page, label: string | RegExp) {
    this.page = page;
    this._locator = this.page.locator(
      `xpath=//mat-select[@id=(//label[contains(normalize-space(.), "${label}")]/@for)]`
    );
  }

  async select(option: string): Promise<void> {
    await this._locator.click();
    await this.page.locator(`.mat-option-text >> text=${option}`).click();
  }
}
