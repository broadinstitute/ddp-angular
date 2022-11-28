import { expect, Locator, Page } from '@playwright/test';
import WidgetBase from 'lib/widget/widget-base';

export default class Radiobutton extends WidgetBase {
  private readonly elementLocator: Locator;
  private readonly rootLocator: Locator;

  constructor(page: Page, opts: { label?: string; ddpTestID?: string; root?: Locator | string; exactMatch?: boolean }) {
    super(page);
    const { label, ddpTestID, root, exactMatch = false } = opts;
    this.rootLocator = root ? (typeof root === 'string' ? this.page.locator(root) : root) : this.page.locator('mat-radio-group');
    // prettier-ignore
    /* eslint-disable max-len */
    this.elementLocator = ddpTestID
        ? this.rootLocator.locator(`mat-radio-button[data-ddp-test="${ddpTestID}"]`) // Label ignored if ddpTestID is specified
        : exactMatch
            ? this.rootLocator.locator(`xpath=//mat-radio-button[.//input[@id=(//label[.//text()[normalize-space()="${label}"]]/@for)]]`)
            : this.rootLocator.locator(`xpath=//mat-radio-button[.//input[@id=(//label[contains(normalize-space(.),"${label}")]/@for)]]`);
  }

  toLocator(): Locator {
    return this.elementLocator;
  }

  async check(): Promise<void> {
    const isChecked = await this.isChecked();
    if (!isChecked) {
      await this.toLocator().click();
      await expect(this.toLocator()).toHaveClass(/radio-checked/);
    }
  }

  async uncheck(): Promise<void> {
    const isChecked = await this.isChecked();
    if (isChecked) {
      await this.toLocator().click();
      await expect(this.toLocator()).not.toHaveClass(/radio-checked/);
    }
  }

  private async isChecked(): Promise<boolean> {
    const isChecked = (await this.toLocator().getAttribute('class'))?.includes('mat-radio-checked');
    return isChecked ? isChecked : false;
  }
}
