import { Locator, Page } from '@playwright/test';
import Input from 'lib/widget/input';
import Select from 'lib/widget/select';

export default class DdpAddress {
  private readonly page: Page;
  private readonly elementLocator: Locator;
  private readonly rootLocator: Locator;

  constructor(page: Page, opts: { label: string | RegExp; root?: Locator | string; nth?: number }) {
    const { label, root, nth = 0 } = opts;
    this.page = page;
    this.rootLocator = root
      ? typeof root === 'string'
        ? this.page.locator(root)
        : root
      : this.page.locator('ddp-address-embedded');
    this.elementLocator = this.rootLocator.filter({ hasText: label }).nth(nth);
  }

  input(label: string): Input {
    return new Input(this.page, { label, root: this.toLocator() });
  }

  select(label: string): Select {
    return new Select(this.page, { label, root: this.toLocator() });
  }

  toLocator(): Locator {
    return this.elementLocator;
  }
}
