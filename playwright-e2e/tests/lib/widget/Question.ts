import { Locator, Page } from '@playwright/test';

export default class Question {
  private readonly page: Page;
  private readonly _locator: Locator;

  constructor(page: Page, label: string | RegExp) {
    this.page = page;
    this._locator = this.page
      .locator('ddp-activity-question')
      .filter({ has: this.page.locator('ddp-question-prompt') })
      .filter({ hasText: label });
  }

  get locator(): Locator {
    return this._locator;
  }

  errorMessage(): Locator {
    return this.locator.locator('.ErrorMessage');
  }

  select(label?: string): Locator {
    if (label === undefined) {
      return this.locator.locator('select');
    }
    return this.locator.locator(
      `xpath=//*[.//*[contains(normalize-space(.), "${label}")]]/select` +
        ` | //*[.//*[contains(normalize-space(.), "${label}")]]/mat-select`
    );
  }

  textInput(label?: string): Locator {
    if (label === undefined) {
      return this.locator.locator('input');
    }
    return this.locator.locator(`xpath=//input[@id=(//label[contains(normalize-space(.), "${label}")]/@for)]`);
  }

  checkbox(label: string | RegExp): Locator {
    return this.locator.locator('label', { hasText: label });
  }

  toggle(label: string | RegExp): Locator {
    return this.locator.locator('label', { hasText: label });
  }
}
