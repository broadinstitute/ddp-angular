import { Locator, Page, expect } from '@playwright/test';
import { waitForResponse } from 'utils/test-utils';

export default class Lookup {
  private readonly locator: Locator;

  constructor(private readonly page: Page, private readonly root: Locator | string, opts: { label: string | RegExp }) {
    const { label } = opts;
    const rootLocator = typeof root === 'string' ? this.page.locator(root) : root;
    this.locator = label
      ? rootLocator.filter({ hasText: label }).locator('app-lookup')
      : rootLocator.locator('app-lookup');
  }

  get toLocator(): Locator {
    return this.locator;
  }

  public async select(opts: { text?: string, index?: number } = {}): Promise<string> {
    const { text, index = 0 } = opts;

    await expect(this.toLocator.locator('ul')).toBeVisible();
    const count = await this.toLocator.locator('ul').count();
    if (count === 0) {
      throw new Error('Lookup list count is 0');
    }

    let li: Locator;
    if (index) {
      li = this.toLocator.locator('li').nth(index);
    } else {
      li = this.toLocator.locator('li', { hasText: text }).first();
    }
    const value = (await li.innerText()).trim();

    await Promise.all([
      waitForResponse(this.page, { uri: '/patch' }),
      li.click()
    ]);
    return value;
  }
}
