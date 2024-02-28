import {expect, Locator, Page} from '@playwright/test';
import {Tab} from 'dsm/enums';
import ContactInformationTab from 'dsm/component/tabs/contact-information-tab';
import GenomeStudyTab from 'dsm/component/tabs/genome-study-tab';
import SampleInformationTab from 'dsm/component/tabs/sample-information-tab';
import OncHistoryTab from './onc-history-tab';
import MedicalRecordsTab from 'dsm/pages/medical-records/medical-records-tab';
import SurveyDataTab from './survey-data-tab';
import {waitForNoSpinner} from 'utils/test-utils';

export default class Tabs {
  private readonly tabs = new Map<string, object>([
    [Tab.CONTACT_INFORMATION, new ContactInformationTab(this.page)],
    [Tab.SAMPLE_INFORMATION, new SampleInformationTab(this.page)],
    [Tab.GENOME_STUDY, new GenomeStudyTab(this.page)],
    [Tab.ONC_HISTORY, new OncHistoryTab(this.page)],
    [Tab.MEDICAL_RECORD, new MedicalRecordsTab(this.page)],
    [Tab.SURVEY_DATA, new SurveyDataTab(this.page)],
  ]);

  constructor(private readonly page: Page) {}

  public async clickTab<T extends object>(tabName: Tab): Promise<T> {
    await this.open(tabName);
    return (this.tabs as Map<string, object>).get(tabName) as T;
  }

  public async isTabVisible(tabName: Tab): Promise<boolean> {
    const isTabVisible: boolean = await this.tabLocator(tabName).isVisible();
    let contactInformationEntered = true;
    if (isTabVisible && tabName === Tab.CONTACT_INFORMATION) {
      await this.clickTab(tabName);
      contactInformationEntered = await this.HasContactInformationTabEnteredData();
    }
    return isTabVisible && contactInformationEntered;
  }

  private async isOpen(tabName: Tab): Promise<boolean> {
    const clas = await this.tabLocator(tabName).getAttribute('class');
    return clas ? clas.includes('active') : false;
  }

  public async open(tabName: Tab): Promise<void> {
    await expect(async () => {
      if (!(await this.isOpen(tabName))) {
        await this.tabLocator(tabName).click();
      }
      await waitForNoSpinner(this.page);
      expect(await this.isOpen(tabName)).toBe(true);
    }).toPass();
  }

  private async HasContactInformationTabEnteredData(): Promise<boolean> {
    const isNotEnteredVisible = await (this.tabs.get(Tab.CONTACT_INFORMATION) as ContactInformationTab)
      .isNotEnteredVisible();
    return !isNotEnteredVisible;
  }

  /* Locators */
  public tabLocator(tabName: Tab): Locator {
    return this.page.locator(this.getTabXPath(tabName))
  }

  /* XPaths */
  private getTabXPath(tabName: Tab) {
    return `//tabset/ul[@role='tablist']/li[a[span[text()[normalize-space()='${tabName}']]]]`
  }
}
