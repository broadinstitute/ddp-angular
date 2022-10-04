import { Locator, Page } from '@playwright/test';

export default class Card {
  private readonly page: Page;
  private rootLocator: Locator;

  constructor(page: Page, label: string | RegExp) {
    this.page = page;
    this.rootLocator = page
      .locator('mat-card')
      .filter({ has: this.page.locator('mat-card-header', { hasText: label }) });
  }

  radioButton(label: string): Locator {
    return this.rootLocator.locator('mat-radio-button', { hasText: label });
  }
}
