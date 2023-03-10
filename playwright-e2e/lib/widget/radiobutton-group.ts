import { Locator, Page } from '@playwright/test';
import Radiobutton from 'lib/widget/radiobutton';
import WidgetBase from 'lib/widget/widget-base';

export default class RadiobuttonGroup extends WidgetBase {
  private readonly elementLocator: Locator;
  private readonly rootLocator: Locator | undefined;

  /* prettier-ignore */
  constructor(page: Page, opts: { prompt?: string; ddpTestID?: string; root?: Locator | string; exactMatch?: boolean }) {
    super(page);
    const { prompt, ddpTestID, root, exactMatch = false } = opts;

    if (ddpTestID) {
      this.elementLocator = this.page.locator(`xpath=//mat-radio-group[@data-ddp-test="${ddpTestID}"]`);
      return;
    }

    if (!prompt) {
      throw new Error('Missing Parameter: prompt is undefined');
    }

    this.rootLocator = root
      ? (typeof root === 'string' ? this.page.locator(root) : root)
      : this.page.locator('xpath=//mat-radio-group');

    this.elementLocator = exactMatch
      ? this.rootLocator
        .filter({ has: this.page.locator(`xpath=/parent::node()[.//text()[normalize-space()="${prompt}"]]`) })
      : this.rootLocator
        .filter({ has: this.page.locator(`xpath=/parent::node()[.//text()[contains(normalize-space(), "${prompt}")]]`) });
  }

  toLocator(): Locator {
    return this.elementLocator;
  }

  radiobutton(radioLabel: string): Radiobutton {
    return new Radiobutton(this.page, { label: radioLabel, root: this.toLocator() });
  }
}
