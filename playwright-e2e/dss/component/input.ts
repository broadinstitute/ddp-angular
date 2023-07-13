import { Locator, Page } from '@playwright/test';
import WidgetBase from 'dss/component/widget-base';
import { waitForResponse } from 'utils/test-utils';

export default class Input extends WidgetBase {
  /**
   * @param {Page} page
   * @param {{label?: string, ddpTestID?: string, root?: Locator | string, exactMatch?: boolean}} opts
   */
  constructor(page: Page, opts: { label?: string | RegExp; ddpTestID?: string; root?: Locator | string; exactMatch?: boolean; nth?: number } = {}) {
    const { label, ddpTestID, root = 'mat-form-field', exactMatch = false, nth } = opts;
    super(page, { root, testId: ddpTestID, nth });

    if (!ddpTestID) {
      const partialXpath = 'input[contains(@class, "mat-input-element")]';
      if (label) {
        if (typeof label === 'string') {
          this.element = exactMatch
            /* eslint-disable max-len */
            ? this.root.locator(
              `xpath=.//${partialXpath}[@id=(//label[.//text()[normalize-space()="${label}"]]/@for)] | .//${partialXpath}[@data-placeholder="${label}"]`
            )
            : this.root.locator(
              `xpath=.//${partialXpath}[@id=(//label[contains(normalize-space(.),"${label}")]/@for)] | .//${partialXpath}[contains(@data-placeholder,"${label}")]`
            );
        } else {
          this.element = this.root.filter({ has: this.page.locator(`text=${label}`) }).locator(`xpath=.//${partialXpath}`);
        }
      } else {
        this.element = this.root.locator(`xpath=.//${partialXpath}`);
      }
    }
  }

  /**
   * Enter a text string. If value already exists, no action taken.
   * @param {string} value
   * @param opts
   * @returns {Promise<void>}
   */
  async fill(value: string | number, opts: { dropdownOption?: string, type?: boolean, nth?: number, waitForSavingRequest?: boolean } = {}): Promise<void> {
    const { dropdownOption, type, nth, waitForSavingRequest = false } = opts;

    const useType = type ? type : false;
    nth ? this.nth = nth : this.nth;

    const existValue = await this.toLocator().inputValue();
    if (existValue !== value) {
      const autocomplete = await this.getAttribute('aria-autocomplete');
      useType
        ? await this.toLocator().type(value as string, { delay: 200 })
        : await this.toLocator().fill(value as string);

      const expanded = await this.getAttribute('aria-expanded');
      if (autocomplete === 'list' && expanded === 'true') {
        const dropdown = this.page.locator('.mat-autocomplete-visible[role="listbox"][id]');
        await dropdown.waitFor({ state: 'visible', timeout: 30 * 1000 });
        const option = opts ? dropdownOption : value as string;
          await dropdown
            .locator('[role="option"]') //, { has: this.page.locator(`span.mat-option-text:text("${dropdownOption}")`) })
            .filter({ hasText: option })
            .first()
            .click();
      }
      const pressEnter = this.toLocator().press('Tab');
      waitForSavingRequest ? await Promise.all([waitForResponse(this.page, { uri: '/answers'}), pressEnter]) : await pressEnter;
    }
  }
}
