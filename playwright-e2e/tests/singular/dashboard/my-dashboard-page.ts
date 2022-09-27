import { expect, Locator, Page } from '@playwright/test';

export default class MyDashboardPage {
  readonly page: Page;
  readonly title: Locator;
  readonly status: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1.title');
    this.status = page.locator('.enrollmentStatusCompleteText');
  }

  async waitForReady() {
    await expect(this.title).toBeVisible();
    // Add additional checks here
  }

  get titleLocator() {
    return this.title;
  }

  get statusTextLocator() {
    return this.status;
  }
}
