import { Locator, Page } from '@playwright/test';
import Card from 'lib/component/card';
import Input from 'lib/widget/input';
import Select from 'lib/widget/select';
import WidgetBase from 'lib/widget-base';

export default class Address extends WidgetBase {
  constructor(page: Page, opts: { label: string | RegExp; root?: Locator | string; nth?: number }) {
    const { label, root, nth } = opts;
    super(page, { nth, root });
    this.root = this.root.locator('ddp-address-embedded').filter({ hasText: label });
    this.element = this.root;
  }

  toInput(label: string | RegExp): Input {
    return new Input(this.page, { label, root: this.toLocator() });
  }

  toSelect(label: string | RegExp): Select {
    return new Select(this.page, { label, root: this.toLocator() });
  }

  /**
   * <br> Address Validation Card
   * <br> We have checked your address entry and have suggested changes that could help ensure delivery.
   *  Click "Suggested" to update form. You will be able to click "As entered" to restore your original entries.
   *
   * @returns {Card}
   */
  addressSuggestion(): Card {
    return new Card(this.page, {
      label: 'We have checked your address entry and have suggested changes that could help ensure delivery',
      root: this.toLocator()
    });
  }
}
