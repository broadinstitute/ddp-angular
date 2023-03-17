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

  async check(label: string | RegExp, opts?: { exact: boolean }): Promise<void> {
    const isChecked = await this.isChecked(label, opts);
    if (!isChecked) {
      const radio = this.getRadiobuttonByLabel(label, opts);
      await radio.click();
      await expect(radio).toHaveClass(/radio-checked/);
    }
  }

  private async isChecked(label: string | RegExp, opts?: { exact: boolean }): Promise<boolean> {
    const isChecked = (await this.getRadiobuttonByLabel(label, opts).getAttribute('class'))?.includes('mat-radio-checked');
    return isChecked ? isChecked : false;
  }

  private getRadiobuttonByLabel(label: string | RegExp, opts?: { exact: boolean }): Locator {
    return this.toLocator().locator('mat-radio-button')
      .filter({ has: this.page.getByRole('radio', { name: label, exact: opts?.exact }) });
  }
}
