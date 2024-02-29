import { Locator, Page } from '@playwright/test';
import { Tab } from 'dsm/enums';
import DsmPageBase from 'dsm/pages/dsm-page-base';


export default abstract class TabPageBase extends DsmPageBase {
  constructor(page: Page, private readonly tab: Tab) {
    super(page);
  }

  public get toLocator(): Locator {
    return this.page.locator(`//tabset//tab[normalize-space(@heading)="${this.tab}"]`);
  }
}
