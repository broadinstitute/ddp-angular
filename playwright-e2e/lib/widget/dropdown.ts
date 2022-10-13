import { Locator, Page } from '@playwright/test';

/**
 * DSM UI
 */
export default class Dropdown {
  private readonly page: Page;
  private readonly locator: Locator;

  constructor(page: Page, label: string | RegExp) {
    this.page = page;
    this.locator = this.page
      .locator('li.dropdown')
      .filter({ has: this.page.locator('a.dropdown-toggle'), hasText: label });
  }

  toLocator(): Locator {
    return this.locator;
  }

  /**
   * Determine if dropdown is open by look up aria-expanded property
   */
  async isOpen(): Promise<boolean> {
    return (await this.toLocator().locator('a.dropdown-toggle').getAttribute('aria-expanded')) === 'true';
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.toLocator().locator('a.dropdown-toggle').click();
    }
  }

  async selectOption(value: string, opts: { waitForNav?: boolean } = {}): Promise<void> {
    const { waitForNav = false } = opts;
    const navigationPromise = waitForNav ? this.page.waitForNavigation() : Promise.resolve();

    await this.open();
    await Promise.all([
      navigationPromise,
      this.toLocator().locator('ul.dropdown-menu').locator('a[href]', { hasText: value }).click()
    ]);
  }
}
