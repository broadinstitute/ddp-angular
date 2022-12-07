import { Locator, Page } from '@playwright/test';
import WidgetBase from 'lib/widget/widget-base';

/**
 * Works with "mat-select" and "select" web elements
 */
export default class Select extends WidgetBase {
  private readonly elementLocator: Locator;
  private readonly rootLocator: Locator;

  constructor(page: Page, opts: { label?: string; ddpTestID?: string; root?: Locator | string; exactMatch?: boolean }) {
    super(page);
    const { label, ddpTestID, root, exactMatch = false } = opts;
    this.rootLocator = root ? (typeof root === 'string' ? this.page.locator(root) : root) : this.page.locator('mat-form-field');
    // prettier-ignore
    /* eslint-disable max-len */
    this.elementLocator = ddpTestID
        ? this.rootLocator.locator(`mat-select[data-ddp-test="${ddpTestID}"], select[data-ddp-test="${ddpTestID}"]`)
        : exactMatch
            ? this.rootLocator.locator(`xpath=.//select[.//text()[normalize-space()="${label}"]] | .//mat-select[.//text()[normalize-space()="${label}"]]`)
            : this.rootLocator.locator(`xpath=.//select[.//text()[contains(normalize-space(),"${label}")]] | .//mat-select[.//text()[contains(normalize-space(),"${label}")]]`);
  }

  toLocator(): Locator {
    return this.elementLocator;
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
    const { exactMatch = false } = opts;
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
