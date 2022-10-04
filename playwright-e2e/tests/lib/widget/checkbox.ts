import { Locator, Page } from '@playwright/test';

export default class Checkbox {
  private readonly page: Page;
  private rootLocator: Locator;

  constructor(page: Page, label: string | RegExp) {
    this.page = page;
    this.rootLocator = page.locator('mat-checkbox', { hasText: label });
  }

  async check(): Promise<void> {
    await this.rootLocator.locator('label').click();
  }
}
