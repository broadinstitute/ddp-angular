import { Locator, Page } from '@playwright/test';
import Radiobutton from 'dss/component/radiobutton';
import WidgetBase from 'dss/component/widget-base';

export default class Card extends WidgetBase {
  constructor(page: Page, opts: { label: string | RegExp; root?: string | Locator }) {
    const { label, root } = opts;
    super(page, { root });
    this.root = this.root.locator('mat-card').filter({ has: this.page.locator('mat-card-header', { hasText: label }) });
    this.element = this.root;
  }

  toRadioButton(label?: string | RegExp): Radiobutton {
    return new Radiobutton(this.page, { label, root: this.toLocator() });
  }
}
