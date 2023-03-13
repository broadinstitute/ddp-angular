import { Locator, Page } from '@playwright/test';
import WidgetBase from 'lib/widget/widget-base';

export default class TextArea extends WidgetBase {
  /**
   * @param {Page} page
   * @param {{label?: string, ddpTestID?: string, root?: Locator | string, exactMatch?: boolean}} opts
   */
  constructor(page: Page, opts: { label?: string; ddpTestID?: string; root?: Locator | string; exactMatch?: boolean } = {}) {
    super(page, { root: opts.root ? opts.root : 'mat-form-field' });
    const { label, ddpTestID, exactMatch = false } = opts;

    // prettier-ignore
    this.element = ddpTestID
        ? this.page.locator(`[data-ddp-test="${ddpTestID}"]`)
        : exactMatch
            ? this.root.locator(`//textarea[@id=(//label[.//text()[normalize-space()="${label}"]]/@for)]`)
            : this.root.locator(`//textarea[@id=(//label[contains(normalize-space(.),"${label}")]/@for)]`);
  }

  async fill(value: string): Promise<void> {
    await this.toLocator().fill(value);
    await this.toLocator().press('Tab');
  }
}
