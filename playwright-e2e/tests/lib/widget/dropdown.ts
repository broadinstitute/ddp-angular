import { Locator, Page } from '@playwright/test';

export default class Dropdown {
  private readonly page: Page;
  readonly _locator: Locator;

  constructor(page: Page, label: string | RegExp) {
    this.page = page;
    this._locator = this.page
      .locator('li.dropdown')
      .filter({ has: this.page.locator('a.dropdown-toggle'), hasText: label });
  }

  async isOpen(): Promise<boolean> {
    // aria-expanded
    return (await this._locator.locator('a.dropdown-toggle').getAttribute('aria-expanded')) === 'true';
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this._locator.locator('a.dropdown-toggle').click();
    }
  }

  async select(option: string): Promise<void> {
    await this.open();
    await this._locator.locator('ul.dropdown-menu').locator('a[href]', { hasText: option }).click();
  }
}
