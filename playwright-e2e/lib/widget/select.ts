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
            ? this.rootLocator.locator(`xpath=//select[.//text()[normalize-space()="${label}"]] | //mat-form-field[.//text()[normalize-space()="${label}"]]//mat-select`)
            : this.rootLocator.locator(`xpath=//select[.//text()[contains(normalize-space(),"${label}")]] | //mat-form-field[.//text()[contains(normalize-space(),"${label}")]]//mat-select`);
  }

  toLocator(): Locator {
    return this.elementLocator;
  }

  async selectOption(option: string): Promise<void> {
    const tagName = await this.toLocator().evaluate((elem) => elem.tagName);
    switch (tagName) {
      case 'SELECT':
        await this.toLocator().selectOption(option);
        break;
      default:
        // Click first to open mat-select dropdown
        await this.toLocator().click();
        // eslint-disable-next-line no-case-declarations
        const ariaControlsId = await this.toLocator().getAttribute('aria-controls');
        await this.page
          .locator(`#${ariaControlsId}[role="listbox"]`)
          .locator(`mat-option .mat-option-text >> text="${option}"`)
          .click();
        break;
    }
  }
}
