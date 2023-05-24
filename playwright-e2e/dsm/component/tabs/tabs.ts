import {Locator, Page} from '@playwright/test';
import {TabEnum} from 'dsm/component/tabs/enums/tab-enum';
import ContactInformationTab from 'dsm/component/tabs/contactInformationTab';
import SampleInformationTab from 'dsm/component/tabs/sampleInformationTab';

export default class Tabs {
  private readonly tabs = new Map<string, object>([
    [TabEnum.CONTACT_INFORMATION, new ContactInformationTab(this.page)],
    [TabEnum.SAMPLE_INFORMATION, new SampleInformationTab(this.page)]
  ])

  constructor(private readonly page: Page) {}

  public async clickTab<T extends object>(tabName: TabEnum): Promise<T> {
    await this.tabLocator(tabName).click();
    return (this.tabs as Map<string, object>).get(tabName) as T;
  }

  public async isTabVisible(tabName: TabEnum): Promise<boolean> {
    const isTabVisible: boolean = await this.tabLocator(tabName).isVisible();
    let contactInformationEntered = true;
    if (isTabVisible && tabName === TabEnum.CONTACT_INFORMATION) {
      await this.clickTab(tabName);
      contactInformationEntered = await this.HasContactInformationTabEnteredData();
    }
    return isTabVisible && contactInformationEntered;
  }

  private async HasContactInformationTabEnteredData(): Promise<boolean> {
    const isNotEnteredVisible = await (this.tabs.get(TabEnum.CONTACT_INFORMATION) as ContactInformationTab)
      .isNotEnteredVisible()
    return !isNotEnteredVisible;
  }

  /* Locators */
  public tabLocator(tabName: TabEnum): Locator {
    return this.page.locator(this.getTabXPath(tabName))
  }

  /* XPaths */
  private getTabXPath(tabName: TabEnum) {
    return `//tabset/ul[@role='tablist']/li[a[span[text()[normalize-space()='${tabName}']]]]`
  }
}
