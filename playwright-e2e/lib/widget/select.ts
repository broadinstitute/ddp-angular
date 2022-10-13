import { Locator, Page } from '@playwright/test';

/**
 * Works with "mat-select" and "select" web elements
 */
export default class Select {
  private readonly page: Page;
  private readonly locator: Locator;

  constructor(page: Page, opts: { label?: string | RegExp; ddpTestID?: string }) {
    const { label, ddpTestID } = opts;
    this.page = page;

    this.locator = ddpTestID
      ? this.page.locator(`mat-select[data-ddp-test="${ddpTestID}"], select[data-ddp-test="${ddpTestID}"]`)
      : this.page.locator(
          `//*[.//*[contains(normalize-space(.),"${label}")]]/select | ` +
            `//*[.//*[contains(normalize-space(.),"${label}")]]/mat-select`
        );
  }

  toLocator(): Locator {
    return this.locator;
  }

  async selectOption(option: string): Promise<void> {
    const tagName = await this.toLocator().evaluate((elem) => elem.tagName);
    switch (tagName) {
      case 'SELECT':
        await this.locator.selectOption(option);
        break;
      default:
        // opens mat-options in a dropdown
        await this.locator.click();
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
