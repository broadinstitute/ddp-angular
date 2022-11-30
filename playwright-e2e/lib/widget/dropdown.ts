import { Locator, Page } from '@playwright/test';

/**
 * DSM UI
 */
export default class Dropdown {
  private readonly page: Page;
  private readonly locator: Locator;
  private readonly label: string;

  constructor(page: Page, label: string, opts: { exactMatch?: boolean } = {}) {
    const { exactMatch = true } = opts;
    this.page = page;
    this.label = label;
    const textSelector = exactMatch ? `text="${this.label}"` : `text=${this.label}`;
    this.locator = this.page.locator('li.dropdown').filter({ has: this.page.locator(textSelector) });
  }

  toLocator(): Locator {
    return this.locator;
  }

  getLabel(): string {
    return this.label;
  }

  /**
   * Determine if dropdown is open by look up aria-expanded property
   */
  async isOpen(): Promise<boolean> {
    const ariaExpanded = await this.toLocator().locator('a[data-toggle="dropdown"]').getAttribute('aria-expanded');
    return ariaExpanded ? Boolean(ariaExpanded) : false;
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.toLocator().locator('a.dropdown-toggle').click();
    }
  }

  async selectOption(value: string, opts: { waitForNav?: boolean } = {}): Promise<void> {
    const { waitForNav = false } = opts;

    await this.open();
    const navigationPromise = waitForNav ? this.page.waitForNavigation() : Promise.resolve();
    await Promise.all([
      navigationPromise,
      this.toLocator().locator('ul.dropdown-menu').locator('a[href]', { hasText: value }).click()
    ]);
  }
}
