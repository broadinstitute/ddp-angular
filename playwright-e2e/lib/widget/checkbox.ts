import { Locator, Page } from '@playwright/test';

export default class Checkbox {
  private readonly page: Page;
  private readonly locator: Locator;

  /**
   *
   * @param page
   * @param opts Require one parameter: label or ddpTestID
   */
  constructor(page: Page, opts: { label?: string | RegExp; ddpTestID?: string }) {
    const { label, ddpTestID } = opts;
    this.page = page;
    this.locator = ddpTestID
      ? this.page.locator(`mat-checkbox[data-ddp-test="${ddpTestID}"]`)
      : this.page.locator('mat-checkbox').filter({ has: this.page.locator('label', { hasText: label }) });
    // Another locator for reference: xpath=//*[.//*[contains(normalize-space(.), "${label}")]]/mat-checkbox
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
    const isChecked = (await this.toLocator().getAttribute('class'))?.includes('mat-checkbox-checked');
    return isChecked ? isChecked : false;
  }
}
