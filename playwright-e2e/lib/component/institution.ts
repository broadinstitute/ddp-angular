import { Locator, Page } from '@playwright/test';
import Button from 'lib/widget/button';
import Input from 'lib/widget/input';
import Select from 'lib/widget/select';

export default class Institution {
  private readonly page: Page;
  private readonly elementLocator: Locator;
  private readonly rootLocator: Locator;
  private readonly label: string | RegExp;

  constructor(page: Page, opts: { label: string | RegExp; root?: Locator | string; nth?: number }) {
    const { label, root, nth = 0 } = opts;
    this.page = page;
    this.label = label;
    this.rootLocator = root
      ? typeof root === 'string'
        ? this.page.locator(root)
        : root
      : this.page.locator('ddp-institutions-form');
    this.elementLocator = this.rootLocator.filter({ hasText: label }).locator('ddp-institution').nth(nth);
  }

  input(label: string): Input {
    return new Input(this.page, { label, root: this.toLocator() });
  }

  select(label: string): Select {
    return new Select(this.page, { label, root: this.toLocator() });
  }

  button(label: string): Button {
    return new Button(this.page, {
      label,
      root: this.rootLocator.filter({ hasText: this.label })
    });
  }

  toLocator(): Locator {
    return this.elementLocator;
  }
}
