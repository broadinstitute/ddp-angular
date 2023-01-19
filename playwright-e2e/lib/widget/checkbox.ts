import { expect, Locator, Page } from '@playwright/test';
import WidgetBase from 'lib/widget/widget-base';

export default class Checkbox extends WidgetBase {
  private readonly elementLocator: Locator;
  private readonly rootLocator: Locator;

  /**
   *
   * @param page
   * @param opts Require one parameter: label or ddpTestID
   */
  constructor(page: Page, opts: { label?: string; ddpTestID?: string; root?: Locator | string; exactMatch?: boolean }) {
    super(page);
    const { label, ddpTestID, root, exactMatch = false } = opts;
    this.rootLocator = root
      ? typeof root === 'string'
        ? this.page.locator(root)
        : root
      : this.page.locator('mat-list-item, ddp-activity-section, ddp-activity-question');
    // prettier-ignore
    /* eslint-disable max-len */
    this.elementLocator = ddpTestID
        ? this.rootLocator.locator(`mat-checkbox[data-ddp-test="${ddpTestID}"]`) // Label ignored if ddpTestID is specified
        : exactMatch
            ? this.rootLocator.locator(`xpath=//mat-checkbox[.//input[@id=(//label[.//text()[normalize-space()="${label}"]]/@for)]]`)
            : label
                ? this.rootLocator.locator(`xpath=//mat-checkbox[.//input[@id=(//label[contains(normalize-space(.),"${label}")]/@for)]]`)
                : this.rootLocator.locator(`xpath=//mat-checkbox[.//input[@id=(//label/@for)]]`);
  }

  toLocator(): Locator {
    return this.elementLocator;
  }

  async isChecked(): Promise<boolean> {
    const isChecked = (await this.toLocator().getAttribute('class'))?.includes('mat-checkbox-checked');
    return isChecked ? isChecked : false;
  }

  async check(): Promise<void> {
    const isChecked = await this.isChecked();
    if (!isChecked) {
      await this.toLocator().click();
      await expect(this.toLocator()).toHaveClass(/checkbox-checked/);
    }
  }

  async uncheck(): Promise<void> {
    const isChecked = await this.isChecked();
    if (isChecked) {
      await this.toLocator().click();
      await expect(this.toLocator()).not.toHaveClass(/checkbox-checked/);
    }
  }

  /**
   * Typing text in an Input field, visible after checked a checkbox.
   * @param value
   */
  async fill(value: string | undefined): Promise<void> {
    if (value) {
      const inputLocator = this.toLocator().locator(
        'xpath=ancestor::mat-list-item//input[contains(@class, "mat-input-element")]'
      );
      await inputLocator.fill(value);
    }
  }
}
