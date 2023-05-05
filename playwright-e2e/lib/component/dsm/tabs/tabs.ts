import {Page} from "@playwright/test";
import {TabEnum} from "./enums/tab-enum";
import ContactInformationTab from "./contactInformationTab";

export default class Tabs {
  private readonly tabs = new Map([
    [TabEnum.CONTACT_INFORMATION, new ContactInformationTab(this.page)]
  ])
  constructor(private readonly page: Page) {
  }

  public async clickTab<T extends object>(tabName: TabEnum): Promise<T> {
    await this.page.locator(this.getTabXPath(tabName)).click();
    return (this.tabs as Map<string, object>).get(tabName) as T;
  }

  /* XPaths */
  private getTabXPath(tabName: TabEnum) {
    return `//tabset/ul[@role='tablist']/li[a[span[text()[normalize-space()='${tabName}']]]]`
  }
}
