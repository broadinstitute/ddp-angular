import { Locator, Page } from '@playwright/test';
import { WidgetInterface } from 'lib/widget/widget-interface';

export default abstract class WidgetBase implements WidgetInterface {
  protected constructor(readonly page: Page) {
    this.page = page;
  }

  abstract toLocator(): Locator;

  toQuestion(): Locator {
    return this.page.locator('ddp-activity-question').filter({ has: this.toLocator() });
  }

  errorMessage(): Locator {
    return this.toLocator().locator(
      'xpath=/ancestor::ddp-activity-question//*[contains(@class,"ErrorMessage")] | /ancestor::mat-form-field//mat-error'
    );
  }
}
