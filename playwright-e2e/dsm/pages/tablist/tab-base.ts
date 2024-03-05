import { Locator, Page } from '@playwright/test';
import { Tab } from 'dsm/enums';

export default abstract class TabBase {
  constructor(protected readonly page: Page, protected readonly tab: Tab) {
  }

  public get toLocator(): Locator {
    return this.page.locator(`//tabset//tab[normalize-space(@heading)="${this.tab}"]`);
  }
}
