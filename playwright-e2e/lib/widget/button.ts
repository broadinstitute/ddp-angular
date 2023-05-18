import { Locator, Page } from '@playwright/test';
import WidgetBase from 'lib/widget-base';

export default class Button extends WidgetBase {
  constructor(page: Page, opts: { label?: string | RegExp; ddpTestID?: string; root?: Locator | string; exactMatch?: boolean }) {
    const { label, ddpTestID, root, exactMatch = false } = opts;
    super(page, { root: root ? root : 'ddp-activity', testId: ddpTestID });

    if (!ddpTestID) {
      if (label) {
        if (typeof label === 'string') {
          this.element = exactMatch
            ? this.root.locator(`xpath=.//button[.//text()[normalize-space()="${label}"]]`)
            : this.root.locator(`xpath=.//button[.//text()[contains(normalize-space(),"${label}")]]`);
        } else {
          this.element = this.root.locator('button', { hasText: label });
        }
      } else {
        this.element = this.root.locator(`xpath=.//button`);
      }
    }
  }
}
