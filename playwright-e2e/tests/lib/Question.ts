import { Locator, Page } from '@playwright/test';

export default class Question {
  private readonly page: Page;
  private readonly rootLocator: Locator;

  constructor(page: Page, questionPrompt: string | RegExp) {
    this.page = page;
    this.rootLocator = page
      .locator('ddp-activity-question')
      .locator('ddp-activity-answer')
      .filter({ has: this.page.locator(`ddp-question-prompt >> text=${questionPrompt}`) });
  }

  select(): Locator {
    return this.rootLocator.locator('select');
  }

  textInput(): Locator {
    return this.rootLocator.locator('input');
  }

  check(label: string | RegExp): Locator {
    return this.rootLocator.locator('label', { hasText: label });
  }
}
