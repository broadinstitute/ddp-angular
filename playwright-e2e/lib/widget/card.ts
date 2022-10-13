import { Locator, Page } from '@playwright/test';
import Radiobutton from './radiobutton';

export default class Card {
  private readonly page: Page;
  private readonly locator: Locator;

  constructor(page: Page, label: string | RegExp) {
    this.page = page;
    this.locator = page.locator('mat-card').filter({ has: this.page.locator('mat-card-header', { hasText: label }) });
  }

  toLocator(): Locator {
    return this.locator;
  }

  radioButton(label: string): Radiobutton {
    return new Radiobutton(this.page, { label });
  }
}
