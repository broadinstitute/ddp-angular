import { expect, Locator, Page } from '@playwright/test';
import WidgetBase from 'lib/widget-base';

export default class Radiobutton extends WidgetBase {
  constructor(page: Page, opts: { label?: string | RegExp; ddpTestID?: string; root?: Locator | string; exactMatch?: boolean } = {}) {
    const { label, ddpTestID, root, exactMatch = false } = opts;
    super(page, { root, testId: ddpTestID });

    if (!ddpTestID) {
      this.root = this.root.locator('mat-radio-group');
      if (label) {
        if (typeof label === 'string') {
          this.element = exactMatch
            ? this.root.filter({ has: this.page.locator(`xpath=.//*[.//text()[normalize-space()="${label}"]]`) })
            : this.root.filter({ has: this.page.locator(`xpath=.//*[.//text()[contains(normalize-space(), "${label}")]]`) });
        } else {
          this.element = this.root.filter({ hasText: label });
        }
      } else {
        this.element = this.root;
      }
    }
  }

  async check(label: string | RegExp): Promise<void> {
    const isChecked = await this.isChecked(label);
    if (!isChecked) {
      await this.getRadiobuttonByLabel(label).click();
      await expect(this.getRadiobuttonByLabel(label)).toHaveClass(/radio-checked/);
    }
  }

  private async isChecked(label: string | RegExp): Promise<boolean> {
    const isChecked = (await this.getRadiobuttonByLabel(label).getAttribute('class'))?.includes('mat-radio-checked');
    return isChecked ? isChecked : false;
  }

  private getRadiobuttonByLabel(label: string | RegExp): Locator {
    return this.toLocator().locator('mat-radio-button', { hasText: label });
  }
}
