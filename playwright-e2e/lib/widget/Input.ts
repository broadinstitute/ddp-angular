import { Locator, Page } from '@playwright/test';

export default class Input {
  private readonly page: Page;
  private readonly locator: Locator;

  constructor(page: Page, opts: { label?: string; ddpTestID?: string; parent?: Locator } = {}) {
    const { label, ddpTestID, parent } = opts;
    this.page = page;
    const rootLocator = parent ? parent : this.page.locator('body');
    this.locator = ddpTestID
      ? this.page.locator(`input[data-ddp-test="${ddpTestID}"]`)
      : rootLocator.locator(`//input[@id=(//label[contains(normalize-space(.),"${label}")]/@for)]`);
  }

  toLocator(): Locator {
    return this.locator;
  }

  async fill(value: string): Promise<void> {
    await this.toLocator().fill(value);
    await this.toLocator().press('Tab');
  }

  errorMessage(): Locator {
    // '//ddp-activity-question[.//input[@data-ddp-test="answer:PREQUAL_AGE"]]//*[contains(@class,"ErrorMessage")]'
    return this.page.locator('ddp-activity-question').filter({ has: this.toLocator() }).locator('.ErrorMessage');
  }

  toQuestion(): Locator {
    return this.page.locator('ddp-activity-question').filter({ has: this.toLocator() });
  }
}
