import { Locator, Page } from '@playwright/test';
import WidgetBase from 'lib/widget-base';

export default class Input extends WidgetBase {
  /**
   * @param {Page} page
   * @param {{label?: string, ddpTestID?: string, root?: Locator | string, exactMatch?: boolean}} opts
   */
  constructor(page: Page, opts: { label?: string | RegExp; ddpTestID?: string; root?: Locator | string; exactMatch?: boolean; nth?: number } = {}) {
    const { label, ddpTestID, root, exactMatch = false, nth } = opts;
    super(page, { root, testId: ddpTestID, nth });

    if (!ddpTestID) {
      this.root = this.root.locator('mat-form-field');
      if (label) {
        if (typeof label === 'string') {
          this.element = exactMatch
            ? this.root.locator(
              `xpath=.//input[@id=(//label[.//text()[normalize-space()="${label}"]]/@for)] | .//input[@data-placeholder="${label}"]`
            )
            : this.root.locator(
              `xpath=.//input[@id=(//label[contains(normalize-space(.),"${label}")]/@for)] | .//input[contains(@data-placeholder,"${label}")]`
            );
        } else {
          this.element = this.root.filter({ has: this.page.locator(`text=${label}`) }).locator('input');
        }
      } else {
        this.element = this.root.locator('input');
      }
    }
  }

  /**
   * Enter a text string. If value already exists, no action taken.
   * @param {string} value
   * @param opts
   * @returns {Promise<void>}
   */
  async fill(value: string | number, opts?: { dropdownOption: string, type?: boolean }): Promise<void> {
    const useType = opts?.type ? opts.type : false;
    const existValue = await this.toLocator().inputValue();
    if (existValue !== value) {
      const autocomplete = await this.getAttribute('aria-autocomplete');
      useType
        ? await this.toLocator().type(value as string, { delay: 200 })
        : await this.toLocator().fill(value as string);

      const expanded = await this.getAttribute('aria-expanded');
      if (autocomplete === 'list' && expanded === 'true') {
        const dropdown = this.page.locator('.mat-autocomplete-visible[role="listbox"][id]');
        const dropdownOption = opts ? opts.dropdownOption : value as string;
          await dropdown
            .locator('[role="option"]') //, { has: this.page.locator(`span.mat-option-text:text("${dropdownOption}")`) })
            .filter({ hasText: dropdownOption })
            .first()
            .click();
      }
      await this.toLocator().press('Tab');
    }
  }
}
