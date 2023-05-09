import {expect, Page} from "@playwright/test";
import {TabEnum} from "./enums/tab-enum";
import ContactInformationTab from "./contactInformationTab";
import SampleInformationTab from "./sampleInformationTab";

export default class Tabs {
  private readonly tabs = new Map<string, object>([
    [TabEnum.CONTACT_INFORMATION, new ContactInformationTab(this.page)],
    [TabEnum.SAMPLE_INFORMATION, new SampleInformationTab(this.page)]
  ])

  constructor(private readonly page: Page) {}

  public async clickTab<T extends object>(tabName: TabEnum): Promise<T> {
    const tab = this.page.locator(this.getTabXPath(tabName));
    await expect(tab, `The tab '${tabName}' is not visible`).toBeVisible();
    await tab.click();
    return (this.tabs as Map<string, object>).get(tabName) as T;
  }

  /* XPaths */
  private getTabXPath(tabName: TabEnum) {
    return `//tabset/ul[@role='tablist']/li[a[span[text()[normalize-space()='${tabName}']]]]`
  }
}
