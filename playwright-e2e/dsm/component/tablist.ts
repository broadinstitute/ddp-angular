import { Locator, Page, expect } from '@playwright/test';
import { Tab } from 'dsm/enums';
import ContactInformationTab from 'dsm/pages/tablist/contact-information-tab';
import GenomeStudyTab from 'dsm/pages/tablist/genome-study-tab';
import OncHistoryTab from 'dsm/pages/tablist/onc-history-tab';
import SampleInformationTab from 'dsm/pages/tablist/sample-information-tab';
import SurveyDataTab from 'dsm/pages/tablist/survey-data-tab';
import SequencingOrderTab from 'dsm/pages/tablist/sequencing-order-tab';
import MedicalRecordsTab from 'dsm/pages/medical-records/medical-records-tab';
import { waitForNoSpinner } from 'utils/test-utils';

export default class Tablist {
  protected readonly tabs = new Map<string, object>([
    [Tab.CONTACT_INFORMATION, new ContactInformationTab(this.page)],
    [Tab.SAMPLE_INFORMATION, new SampleInformationTab(this.page)],
    [Tab.GENOME_STUDY, new GenomeStudyTab(this.page)],
    [Tab.ONC_HISTORY, new OncHistoryTab(this.page)],
    [Tab.MEDICAL_RECORD, new MedicalRecordsTab(this.page)],
    [Tab.SURVEY_DATA, new SurveyDataTab(this.page)],
    [Tab.SEQUENCING_ORDER, new SequencingOrderTab(this.page)],
  ]);

  public constructor(private readonly page: Page, private readonly tab: Tab | string) {
  }

  public async isVisible(): Promise<boolean> {
    try {
      await expect(this.link).toBeVisible();
    } catch (err) {
      return false;
    }

    let contactInformationEntered = true;
    if (this.tab === Tab.CONTACT_INFORMATION) {
      await this.checkAndClick();
      contactInformationEntered = await this.HasContactInformationData();
    }
    return contactInformationEntered;
  }

  protected async isActive(): Promise<boolean> {
    const clas = await this.link.getAttribute('class');
    return clas ? clas.includes('active') : false;
  }

  public async click<T extends object>(): Promise<T> {
    await expect(this.link, `Tab "${this.tab}" is not enabled`).toBeEnabled();
    await this.checkAndClick();
    return (this.tabs as Map<string, object>).get(this.tab) as T;
  }

  protected async HasContactInformationData(): Promise<boolean> {
    const isNotEnteredVisible = await (this.tabs.get(Tab.CONTACT_INFORMATION) as ContactInformationTab)
      .isNotEnteredVisible();
    return !isNotEnteredVisible;
  }

  private async checkAndClick(): Promise<void> {
    await expect(async () => {
      const isOpen = await this.isActive();
      if (!isOpen) {
        await this.link.click();
      }
      await waitForNoSpinner(this.page);
      expect(await this.isActive()).toBe(true);
    }).toPass();
  }

  /* Locators */

  private get link(): Locator {
    return this.page.locator(`xpath=//tabset//*[@role="tablist"]//a[@role="tab"][.//text()[normalize-space()="${this.tab}"]]`);
  }
}
