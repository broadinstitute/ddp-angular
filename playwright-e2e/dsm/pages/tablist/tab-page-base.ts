import { Locator, Page } from '@playwright/test';
import { Tab } from 'dsm/enums';

export default abstract class TabPageBase {
  constructor(protected readonly page: Page, protected readonly tab: Tab) {
  }

  public get rootLocator(): Locator {
    return this.page.locator(`//tabset//tab[normalize-space(@heading)="${this.tab}"]`);
  }
}
