import { Locator, Page } from '@playwright/test';
import WidgetBase from 'lib/widget/widget-base';

export default class Input extends WidgetBase {
  private readonly elementLocator: Locator;
  private readonly rootLocator: Locator;

  /**
   * @param {Page} page
   * @param {{label?: string, ddpTestID?: string, root?: Locator | string, exactMatch?: boolean}} opts
   */
  constructor(page: Page, opts: { label?: string; ddpTestID?: string; root?: Locator | string; exactMatch?: boolean } = {}) {
    super(page);
    const { label, ddpTestID, root, exactMatch = false } = opts;
    // prettier-ignore
    this.rootLocator = root
        ? (typeof root === 'string'
          ? this.page.locator(root)
          : root)
        : this.page.locator('mat-form-field');
    // prettier-ignore
    this.elementLocator = ddpTestID
        ? this.rootLocator.locator(`input[data-ddp-test="${ddpTestID}"]`) // Label ignored if ddpTestID is specified
        : exactMatch
            ? this.rootLocator.locator(`xpath=.//input[@id=(//label[.//text()[normalize-space()="${label}"]]/@for)]`)
            : this.rootLocator.locator(`xpath=.//input[@id=(//label[contains(normalize-space(.),"${label}")]/@for)]`);
  }

  /**
   * Enter a text string. If value already exists, no action taken.
   * @param {string} value
   * @returns {Promise<void>}
   */
  async fill(value: string): Promise<void> {
    const existValue = await this.toLocator().inputValue();
    if (existValue !== value) {
      const autocomplete = await this.toLocator().getAttribute('aria-autocomplete');
      await this.toLocator().fill(value);
      const expanded = await this.toLocator().getAttribute('aria-expanded');
      if (autocomplete === 'list' && expanded === 'true') {
        const dropdown = this.page.locator('.mat-autocomplete-visible[role="listbox"][id]');
        await dropdown
          .locator('mat-option:visible', { hasText: new RegExp(value) })
          .first()
          .click();
      } else {
        await this.toLocator().press('Tab');
      }
    }
  }

  toLocator(): Locator {
    return this.elementLocator.nth(this.nth);
  }
}
