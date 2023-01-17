import { Locator, Page } from '@playwright/test';
import WidgetBase from 'lib/widget/widget-base';

export default class Button extends WidgetBase {
  private readonly elementLocator: Locator;
  private readonly rootLocator: Locator;

  constructor(page: Page, opts: { label?: string; ddpTestID?: string; root?: Locator | string; exactMatch?: boolean }) {
    super(page);
    const { label, ddpTestID, root, exactMatch = false } = opts;
    /* prettier-ignore */
    this.rootLocator = root
        ? (typeof root === 'string'
            ? this.page.locator(root)
            : root)
        : this.page.locator('ddp-activity');
    /* prettier-ignore */
    this.elementLocator = ddpTestID
        ? this.rootLocator.locator(`button[data-ddp-test="${ddpTestID}"]`)
        : label
            ? exactMatch
                ? this.rootLocator.locator(`xpath=.//button[.//text()[normalize-space()="${label}"]]`)
                : this.rootLocator.locator(`xpath=.//button[.//text()[contains(normalize-space(),"${label}")]]`)
            : this.rootLocator.locator(`xpath=.//button`).first();
  }

  toLocator(): Locator {
    return this.elementLocator;
  }

  async click(): Promise<void> {
    await this.toLocator().click();
  }
}
