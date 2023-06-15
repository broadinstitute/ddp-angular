import { Locator, Page } from '@playwright/test';
import { TabEnum } from 'dsm/component/tabs/enums/tab-enum';
import Tab from 'dsm/component/tabs/tab';

export default class RgpParticipantPageTabPanel {
  tab: Tab;

  constructor(private readonly page: Page) {
    this.tab = new Tab(this.page);
  }

  async open(tabName: TabEnum): Promise<void> {
    const isOpen = await this.isOpen(tabName);
    if (!isOpen) {
      const tabLocator = this.tab.tabLocator(tabName);
      await tabLocator.click();
    }
  }

  async isOpen(tabName: TabEnum): Promise<boolean> {
    const attr = await this.toLocator(tabName).getAttribute('class');
    if (attr === null) {
      throw Error('Error: Cannot find attribute class');
    }
    return attr.includes('panel-open');
  }

  toLocator(tabName: TabEnum): Locator {
    let id;
    switch (tabName) {
      case TabEnum.CONTACT_INFO:
        id = 'RGP_CONTACT_INFO_GROUP';
        break;
      default:
        break;
    }
    return this.page.locator(`//accordion-group[.//*[@id="${id}"]]`);
  }
}
