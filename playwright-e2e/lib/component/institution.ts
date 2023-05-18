import { Locator, Page } from '@playwright/test';
import Button from 'lib/widget/button';
import Input from 'lib/widget/input';
import Select from 'lib/widget/select';
import WidgetBase from 'lib/widget-base';

export default class Institution extends WidgetBase {
  constructor(page: Page, opts: { label: string | RegExp; root?: Locator | string; nth?: number }) {
    const { label, root, nth } = opts;
    super(page, { nth, root });
    this.root = this.root.locator('ddp-institutions-form').filter({ hasText: label });
    this.element = this.root.locator('ddp-institution');
  }

  toInput(label: string | RegExp): Input {
    return new Input(this.page, { label, root: this.toLocator() });
  }

  toSelect(label: string | RegExp): Select {
    return new Select(this.page, { label, root: this.toLocator() });
  }

  toButton(label: string): Button {
    return new Button(this.page, { label, root: this.root });
  }
}
