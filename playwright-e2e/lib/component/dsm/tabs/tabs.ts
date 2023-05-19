import {Locator, Page} from '@playwright/test';
import {TabEnum} from './enums/tab-enum';
import ContactInformationTab from './contactInformationTab';
import SampleInformationTab from './sampleInformationTab';

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
    const isContentEntered = tabName === TabEnum.CONTACT_INFORMATION ?
      await (this.tabs.get(tabName) as ContactInformationTab).isInformationEntered() :
      true;

    return isTabVisible && isContentEntered;
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
