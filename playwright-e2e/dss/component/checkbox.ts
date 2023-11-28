import { expect, Locator, Page } from '@playwright/test';
import WidgetBase from 'dss/component/widget-base';

/**
 * mat-checkbox
 */
export default class Checkbox extends WidgetBase {
  /**
   *
   * @param page
   * @param opts Require one parameter: label or ddpTestID
   */
  constructor(page: Page, opts: { label?: string | RegExp; ddpTestID?: string; root?: Locator | string; exactMatch?: boolean }) {
    const { label, ddpTestID, root, exactMatch = false } = opts;
    super(page, { root: root ? root : 'mat-list-item, ddp-activity-section, ddp-activity-question', testId: ddpTestID });

    if (!ddpTestID) {
      if (label) {
        if (typeof label === 'string') {
          this.element = exactMatch
            ? this.root.locator(`xpath=.//mat-checkbox[.//input[@type="checkbox" and @id=(//label[.//text()[normalize-space()="${label}"]]/@for)]]`)
            : this.root.locator(`xpath=.//mat-checkbox[.//input[@type="checkbox" and @id=(//label[contains(normalize-space(.),"${label}")]/@for)]]`);
        } else {
          this.element = this.root.locator('mat-checkbox').filter({ has: this.page.locator('label', { hasText: label }) });
        }
      } else {
        this.element = this.root.locator(`xpath=.//mat-checkbox[.//input[@id=(//label/@for)]]`);
      }
    }
  }

  async isChecked(): Promise<boolean> {
    const isChecked = (await this.toLocator().getAttribute('class'))?.includes('mat-checkbox-checked');
    return isChecked ? isChecked : false;
  }

  async check(opts: { timeout?: number, callback?: () => any } = {}): Promise<void> {
    const { timeout, callback } = opts;
    const isChecked = await this.isChecked();
    const callbackPromise = callback ? callback() : Promise.resolve();
    if (!isChecked) {
      await Promise.all([
        callbackPromise,
        this.toLocator().click(),
        expect(this.toLocator()).toHaveClass(/checkbox-checked/, { timeout })
      ]);
    }
  }

  async uncheck(opts: { callback?: () => any } = {}): Promise<void> {
    const { callback } = opts;
    const isChecked = await this.isChecked();
    if (isChecked) {
      const callbackPromise = callback ? callback() : Promise.resolve();
      await Promise.all([
        callbackPromise,
        this.toLocator().click(),
        expect(this.toLocator()).not.toHaveClass(/checkbox-checked/)
      ]);
    }
  }

  /**
   * Typing text in an Input field, visible after checked a checkbox.
   * @param value
   */
  async fill(value: string | undefined): Promise<void> {
    if (value) {
      const inputLocator = this.toLocator().locator('xpath=ancestor-or-self::mat-list-item//input[contains(@class, "mat-input-element")]');
      await inputLocator.fill(value);
    }
  }

  getNestedCheckbox(label?: string | RegExp): Locator {
    return this.toRootLocator().locator('xpath=.//mat-list-item/following-sibling::*[contains(@class, "ddp-nested-picklist")]');
  }
}
