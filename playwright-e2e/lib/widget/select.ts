import { Locator, Page } from '@playwright/test';
import WidgetBase from 'lib/widget-base';

/**
 * Works with "mat-select" and "select" web elements
 */
export default class Select extends WidgetBase {
  constructor(page: Page, opts: { label?: string | RegExp; ddpTestID?: string; root?: Locator | string; exactMatch?: boolean }) {
    const { label, ddpTestID, root, exactMatch = false } = opts;
    super(page, { root: root ? root : 'mat-form-field', testId: ddpTestID });

    if (!ddpTestID) {
      if (label) {
        if (typeof label === 'string') {
          this.element = exactMatch
            ? this.root.locator(
              `xpath=.//select[.//text()[normalize-space()="${label}"]] | ` +
              `.//mat-select[.//text()[normalize-space()="${label}"]] | ` +
              `.//mat-select[@id=(//label[normalize-space(.)="${label}"]/@for)]`
            )
            : this.root.locator(
              `xpath=.//select[.//text()[contains(normalize-space(),"${label}")]] | ` +
              `.//mat-select[.//text()[contains(normalize-space(),"${label}")]] | ` +
              `.//mat-select[@id=(//label[contains(normalize-space(.),"${label}")]/@for)]`
            );
        } else {
          this.element = this.root.locator('select, mat-select').filter({ has: this.page.locator('label', { hasText: label }) });
        }
      } else {
        this.element = this.root.locator('select, mat-select');
      }
    }
  }

  /**
   *
   * Select by `option.value`.
   *
   * @param {string} value
   * @param opts
   * @returns {Promise<void>}
   */
  async selectOption(value: string, opts: { exactMatch?: boolean } = {}): Promise<void> {
    const { exactMatch = true } = opts;
    const tagName = await this.toLocator().evaluate((elem) => elem.tagName);
    switch (tagName) {
      case 'SELECT':
        await this.toLocator().selectOption(value);
        break;
      default:
        // Click first to open mat-select dropdown
        await this.toLocator().click();
        // eslint-disable-next-line no-case-declarations
        const ariaControlsId = await this.toLocator().getAttribute('aria-controls');
        if (!ariaControlsId) {
          throw Error('ERROR: Cannot find attribute "aria-controls"');
        }
        /* eslint-disable no-case-declarations */
        const dropdown = this.page.locator(`#${ariaControlsId}[role="listbox"]`);
        const ariaMultiSelectable = await dropdown.getAttribute('aria-multiselectable');
        const isMultiSelectable = ariaMultiSelectable ? ariaMultiSelectable === 'true' : false;
        if (exactMatch) {
          await dropdown.locator(`mat-option .mat-option-text >> text="${value}"`).click();
        } else {
          await dropdown.locator(`mat-option .mat-option-text >> text=${value}`).click();
        }
        if (isMultiSelectable) {
          // Use tab to close multiSelectable dropdown
          await this.page.keyboard.press('Tab');
        }
        break;
    }
  }
}
