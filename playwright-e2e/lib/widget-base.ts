import { Locator, Page } from '@playwright/test';
import { WidgetInterface } from 'lib/widget-interface';

export default abstract class WidgetBase implements WidgetInterface {
  protected readonly nth: number;
  protected root: Locator;
  protected element: Locator | undefined;

  protected constructor(readonly page: Page, opts: { root?: Locator | string; testId?: string; nth?: number } = {}) {
    const { root, testId, nth = 0 } = opts;
    this.page = page;
    this.nth = nth;
    this.root = root ? (typeof root === 'string' ? this.page.locator(root) : root) : this.page.locator('app-root');
    if (testId) {
      this.element = this.page.locator(`[data-ddp-test="${testId}"]`)
    }
  }

  toLocator(): Locator {
    return this.element?.nth(this.nth) as Locator;
  }

  toQuestion(): Locator {
    return this.page.locator('ddp-activity-question').filter({ has: this.toLocator() });
  }

  errorMessage(): Locator {
    return this.toLocator().locator(
      'xpath=/ancestor::ddp-activity-question//*[contains(@class,"ErrorMessage")] | /ancestor::mat-form-field//mat-error'
    );
  }

  async click(): Promise<void> {
    await this.toLocator().click();
  }

  async isDisabled(): Promise<boolean> {
    return (await this.toLocator().getAttribute('disabled')) !== null;
  }

  async getAttribute(attributeName: string): Promise<string | null> {
    return this.toLocator().getAttribute(attributeName)
  }
}
