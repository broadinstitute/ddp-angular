import { Locator, Page } from '@playwright/test';
import Card from 'lib/component/card';
import Input from 'lib/widget/input';
import Select from 'lib/widget/select';

export default class Address {
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

  /**
   * <br> Address Validation Card
   * <br> We have checked your address entry and have suggested changes that could help ensure delivery.
   *  Click "Suggested" to update form. You will be able to click "As entered" to restore your original entries.
   *
   * @returns {Card}
   */
  addressSuggestion(): Card {
    return new Card(this.page, 'We have checked your address entry and have suggested changes that could help ensure delivery');
  }
}
