import { Locator, Page } from '@playwright/test';
import WidgetBase from 'lib/widget/widget-base';

export default class Button extends WidgetBase {
  constructor(page: Page, opts: { label?: string | RegExp; ddpTestID?: string; root?: Locator | string; exactMatch?: boolean }) {
    super(page, { root: opts.root ? opts.root : 'ddp-activity' });
    const { label, ddpTestID, exactMatch = false } = opts;

    if (ddpTestID) {
      this.element = this.page.locator(`[data-ddp-test="${ddpTestID}"]`);
    } else if (label) {
      if (typeof label === 'string') {
        this.element = exactMatch
          ? this.root.locator(`xpath=.//button[.//text()[normalize-space()="${label}"]]`)
          : this.root.locator(`xpath=.//button[.//text()[contains(normalize-space(),"${label}")]]`);
      } else {
        this.element = this.root.locator('button', { hasText: label });
      }
    } else {
      this.element = this.root.locator(`xpath=.//button`).first();
    }
  }
}
