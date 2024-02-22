import { Locator, Page } from '@playwright/test';
import { Samples, Study, Miscellaneous, StudyName } from './navigation';

export default class Dropdown {
  private readonly page: Page;
  private readonly locator: Locator;

  constructor(page: Page, label: string, opts: { exactMatch?: boolean } = {}) {
    const { exactMatch = true } = opts;
    this.page = page;
    const textSelector = exactMatch ? `text="${label}"` : `text=${label}`;
    this.locator = this.page.locator('li.dropdown').filter({ has: this.page.locator(textSelector) });
  }

  toLocator(): Locator {
    return this.locator;
  }

  /**
   * Determine if dropdown is open by look up aria-expanded property
   */
  async isOpen(): Promise<boolean> {
    const ariaExpanded = await this.toLocator().locator('a[data-toggle="dropdown"]').getAttribute('aria-expanded');
    return ariaExpanded === 'true';
  }

  async open(): Promise<void> {
    !(await this.isOpen()) && (await this.toLocator().locator('a.dropdown-toggle').click());
  }

  async selectOption(value: string): Promise<void> {
    await (await this.getOption(value)).click();
  }

  async getOption(value: string): Promise<Locator> {
    await this.open();
    return this.toLocator().locator('ul.dropdown-menu').locator('a').getByText(value, {exact: true});
  }

  async getDisplayedOptions<T extends Miscellaneous | Samples | Study | StudyName>(): Promise<T[]> {
    await this.open();
    const options: T[] = [];
    const links: Locator[] = await this.toLocator().locator('ul.dropdown-menu').locator('a').all();
    for (const link of links) {
      const innerText = (await link.innerText()).trim();
      options.push(innerText as T);
    }
    return options;
  }
}
