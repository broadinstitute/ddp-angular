import { expect, Locator, Page } from '@playwright/test';
import { BooleanLiteral } from '@typescript-eslint/types/dist/generated/ast-spec';
import {TabEnum} from 'dsm/component/tabs/enums/tab-enum';
import ContactInformationTab from 'dsm/component/tabs/contactInformationTab';
import GenomeStudyTab from 'dsm/component/tabs/genome-study-tab';
import SampleInformationTab from 'dsm/component/tabs/sampleInformationTab';

export default class Tabs {
  private readonly tabs = new Map<string, object>([
    [TabEnum.CONTACT_INFORMATION, new ContactInformationTab(this.page)],
    [TabEnum.SAMPLE_INFORMATION, new SampleInformationTab(this.page)],
    [TabEnum.GENOME_STUDY, new GenomeStudyTab(this.page)],
  ])

  constructor(private readonly page: Page) {}

  public async clickTab<T extends object>(tabName: TabEnum): Promise<T> {
    await this.tabLocator(tabName).click();
    await expect(await new Tabs(this.page).isOpen(TabEnum.GENOME_STUDY)).toBe(true);
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

  public async isOpen(tabName: TabEnum): Promise<boolean> {
    const clas = await this.tabLocator(tabName).getAttribute('class');
    return clas ? clas.includes('active') : false;
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
