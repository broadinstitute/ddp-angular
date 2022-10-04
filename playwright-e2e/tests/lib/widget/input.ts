import { Locator, Page } from '@playwright/test';

export default class Input {
  private readonly page: Page;
  private readonly _locator: Locator;

  constructor(page: Page, label: string) {
    this.page = page;
    this._locator = this.page.locator(`xpath=//input[@id=(//label[contains(normalize-space(.), "${label}")]/@for)]`);
  }

  get locator(): Locator {
    return this._locator;
  }
}
