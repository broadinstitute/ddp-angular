import {expect, Locator, Page} from '@playwright/test';
import {TabEnum} from 'dsm/component/tabs/enums/tab-enum';
import ContactInformationTab from 'dsm/component/tabs/contact-information-tab';
import GenomeStudyTab from 'dsm/component/tabs/genome-study-tab';
import SampleInformationTab from 'dsm/component/tabs/sample-information-tab';
import OncHistoryTab from './onc-history-tab';
import MedicalRecordsTab from 'dsm/pages/medical-records/medical-records-tab';
import SurveyDataTab from './survey-data-tab';
import SequencingOrderTab from 'dsm/component/tabs/sequencing-order-tab';

import {waitForNoSpinner} from 'utils/test-utils';

export default class Tabs {
  private readonly tabs = new Map<string, object>([
    [TabEnum.CONTACT_INFORMATION, new ContactInformationTab(this.page)],
    [TabEnum.SAMPLE_INFORMATION, new SampleInformationTab(this.page)],
    [TabEnum.GENOME_STUDY, new GenomeStudyTab(this.page)],
    [TabEnum.ONC_HISTORY, new OncHistoryTab(this.page)],
    [TabEnum.MEDICAL_RECORD, new MedicalRecordsTab(this.page)],
    [TabEnum.SURVEY_DATA, new SurveyDataTab(this.page)],
    [TabEnum.SEQUENCING_ORDER, new SequencingOrderTab(this.page)],
  ]);

  constructor(private readonly page: Page) {}

  public async clickTab<T extends object>(tabName: TabEnum): Promise<T> {
    await this.open(tabName);
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

  private async isOpen(tabName: TabEnum): Promise<boolean> {
    const clas = await this.tabLocator(tabName).getAttribute('class');
    return clas ? clas.includes('active') : false;
  }

  public async open(tabName: TabEnum): Promise<void> {
    await expect(async () => {
      if (!(await this.isOpen(tabName))) {
        await this.tabLocator(tabName).click();
      }
      await waitForNoSpinner(this.page);
      expect(await this.isOpen(tabName)).toBe(true);
    }).toPass();
  }

  private async HasContactInformationTabEnteredData(): Promise<boolean> {
    const isNotEnteredVisible = await (this.tabs.get(TabEnum.CONTACT_INFORMATION) as ContactInformationTab)
      .isNotEnteredVisible();
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
