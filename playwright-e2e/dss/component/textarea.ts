import { Locator, Page } from '@playwright/test';
import WidgetBase from 'dss/component/widget-base';

export default class TextArea extends WidgetBase {
  /**
   * @param {Page} page
   * @param {{label?: string, ddpTestID?: string, root?: Locator | string, exactMatch?: boolean}} opts
   */
  constructor(page: Page, opts: { label?: string; ddpTestID?: string; root?: Locator | string; exactMatch?: boolean } = {}) {
    const { label, ddpTestID, root, exactMatch = false } = opts;
    super(page, { root: root ? root : 'mat-form-field', testId: ddpTestID });

    if (!ddpTestID) {
      if (label) {
        this.element = exactMatch
          ? this.root.locator(`//textarea[@id=(//label[.//text()[normalize-space()="${label}"]]/@for)]`)
          : this.root.locator(`//textarea[@id=(//label[contains(normalize-space(.),"${label}")]/@for)]`);
      } else {
        this.element = this.root.locator('textarea');
      }
    }
  }

  async fill(value: string, pressTab = true): Promise<void> {
    await this.toLocator().fill(value);
    pressTab && await this.toLocator().press('Tab');
  }

  async currentValue(): Promise<string> {
    return this.toLocator().inputValue();
  }

  async blur(): Promise<void> {
    await this.toLocator().blur();
  }

  public async maxLength(): Promise<string | null> {
    return this.toLocator().getAttribute('maxlength');
  }
}
