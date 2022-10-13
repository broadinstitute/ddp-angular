import { Locator, Page } from '@playwright/test';

export default class Radiobutton {
  private readonly page: Page;
  private readonly locator: Locator;

  constructor(page: Page, opts: { label?: string | RegExp; ddpTestID?: string }) {
    const { label, ddpTestID } = opts;
    this.page = page;
    this.locator = ddpTestID
      ? this.page.locator(`mat-radio-button[data-ddp-test="${ddpTestID}"]`)
      : this.page.locator('mat-radio-button').filter({ has: this.page.locator('label', { hasText: label }) });
  }

  toLocator(): Locator {
    return this.locator;
  }

  async check(): Promise<void> {
    const isChecked = await this.isChecked();
    if (!isChecked) {
      await this.toLocator().click();
    }
  }

  async uncheck(): Promise<void> {
    const isChecked = await this.isChecked();
    if (isChecked) {
      await this.toLocator().click();
    }
  }

  private async isChecked(): Promise<boolean> {
    const isChecked = (await this.toLocator().getAttribute('class'))?.includes('mat-radio-checked');
    return isChecked ? isChecked : false;
  }
}
