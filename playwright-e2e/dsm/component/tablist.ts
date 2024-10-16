import { Locator, Page, expect } from '@playwright/test';
import { Tab } from 'dsm/enums';
import ContactInformationTab from 'dsm/pages/tablist/contact-information-tab';
import GenomeStudyTab from 'dsm/pages/tablist/genome-study-tab';
import OncHistoryTab from 'dsm/pages/tablist/onc-history-tab';
import SampleInformationTab from 'dsm/pages/tablist/sample-information-tab';
import SurveyDataTab from 'dsm/pages/tablist/survey-data-tab';
import SequencingOrderTab from 'dsm/pages/tablist/sequencing-order-tab';
import MedicalRecordsTab from 'dsm/pages/tablist/medical-records-tab';
import { waitForNoSpinner } from 'utils/test-utils';
import SharedLearningTab from 'dsm/pages/tablist/shared-learning-tab';
import InvitaeTab from 'dsm/pages/tablist/invitae-tab';

export default class Tablist {
  protected readonly tabs = new Map<string, object>([
    [Tab.CONTACT_INFORMATION, new ContactInformationTab(this.page)],
    [Tab.SAMPLE_INFORMATION, new SampleInformationTab(this.page)],
    [Tab.GENOME_STUDY, new GenomeStudyTab(this.page)],
    [Tab.ONC_HISTORY, new OncHistoryTab(this.page)],
    [Tab.MEDICAL_RECORD, new MedicalRecordsTab(this.page)],
    [Tab.SURVEY_DATA, new SurveyDataTab(this.page)],
    [Tab.SEQUENCING_ORDER, new SequencingOrderTab(this.page)],
    [Tab.SHARED_LEARNINGS, new SharedLearningTab(this.page)],
    [Tab.INVITAE, new InvitaeTab(this.page)],
  ]);

  public constructor(private readonly page: Page, private readonly tab: Tab | string) {}

  get toLocator(): Locator {
    return this.page.locator(`xpath=//tabset//*[@role="tablist"]//a[@role="tab"][.//text()[normalize-space()="${this.tab}"]]`);
  }

  public async isVisible(): Promise<boolean> {
    try {
      await expect(this.toLocator).toBeVisible();
    } catch (err) {
      return false;
    }

    let contactInformationEntered = true;
    if (this.tab === Tab.CONTACT_INFORMATION) {
      await this.checkAndClick();
      contactInformationEntered = await this.hasContactInformationData();
    }
    return contactInformationEntered;
  }

  protected async isActive(): Promise<boolean> {
    const clas = await this.toLocator.getAttribute('class');
    return clas ? clas.includes('active') : false;
  }

  public async click<T extends object>(): Promise<T> {
    await expect(this.toLocator, `Tab "${this.tab}" is not enabled`).toBeEnabled();
    await this.checkAndClick();
    return (this.tabs as Map<string, object>).get(this.tab) as T;
  }

  protected async hasContactInformationData(): Promise<boolean> {
    const isNotEnteredVisible = await (this.tabs.get(Tab.CONTACT_INFORMATION) as ContactInformationTab)
      .isNotEnteredVisible();
    return !isNotEnteredVisible;
  }

  private async checkAndClick(): Promise<void> {
    await expect(async () => {
      const isOpen = await this.isActive();
      if (!isOpen) {
        await this.toLocator.click();
      }
      await waitForNoSpinner(this.page);
      expect(await this.isActive()).toBe(true);
    }).toPass();
  }
}
