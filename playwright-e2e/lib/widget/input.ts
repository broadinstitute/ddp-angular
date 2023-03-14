import { Locator, Page } from '@playwright/test';
import WidgetBase from 'lib/widget-base';

export default class Input extends WidgetBase {
  /**
   * @param {Page} page
   * @param {{label?: string, ddpTestID?: string, root?: Locator | string, exactMatch?: boolean}} opts
   */
  constructor(page: Page, opts: { label?: string | RegExp; ddpTestID?: string; root?: Locator | string; exactMatch?: boolean } = {}) {
    const { label, ddpTestID, root, exactMatch = false } = opts;
    super(page, { root: root ? root : 'mat-form-field', testId: ddpTestID });

    if (!ddpTestID) {
      if (label) {
        if (typeof label === 'string') {
          this.element = exactMatch
            ? this.root.locator(`xpath=.//input[@id=(//label[.//text()[normalize-space()="${label}"]]/@for)]`)
            : this.root.locator(`xpath=.//input[@id=(//label[contains(normalize-space(.),"${label}")]/@for)]`);
        } else {
          this.element = this.root.filter({ has: this.page.locator('label', { hasText: label }) }).locator('input');
        }
      } else {
        this.element = this.root.locator('input');
      }
    }
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
      }
      await this.toLocator().press('Tab');
    }
  }
}
