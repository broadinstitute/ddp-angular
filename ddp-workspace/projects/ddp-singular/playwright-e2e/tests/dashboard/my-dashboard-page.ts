import { expect, Locator, Page } from '@playwright/test';

export default class MyDashboardPage {
  readonly page: Page;
  readonly _title: Locator;
  readonly _status: Locator;

  constructor(page: Page) {
    this.page = page;
    this._title = page.locator('h1.title');
    this._status = page.locator('.enrollmentStatusCompleteText');
  }

  async waitForReady() {
    await expect(this._title).toBeVisible();
    // Add additional checks here
  }

  get titleLocator() {
    return this._title;
  }

  get statusTextLocator() {
    return this._status;
  }
}
