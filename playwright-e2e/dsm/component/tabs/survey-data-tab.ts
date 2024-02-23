import { Locator, Page, expect } from '@playwright/test';

export enum SurveyDataPanelEnum {
  MEDICAL_RELEASE_FORM = 'Medical Release Form',
  RESEARCH_CONSENT_ASSENT_FORM = 'Research Consent & Assent Form'
}

export default class SurveyDataTab {
  constructor(private readonly page: Page) {
  }

  public async getActivityData(activity: SurveyDataPanelEnum, label: string): Promise<string[]> {
    await this.activityDataPanel(activity).waitFor({state: 'visible' });
    const region = this.activityDataPanel(activity).locator('xpath=//*[@role="region"]');
    const isVisible = await region.isVisible();
    if (!isVisible) {
      await this.activityDataPanel(activity).click();
      await expect(region).toBeVisible();
    }

    const data = region.locator(
      `xpath=/*[contains(@class, "mat-expansion-panel-body")]/div[.//*[contains(@class, "grey-color")][normalize-space()="${label}"]]`);
    return (await data.innerText()).split('\n+');
  }

  private activityDataPanel(name: string): Locator {
    return this.page.locator(`//app-activity-data[.//mat-expansion-panel-header[.//mat-panel-title[normalize-space(.)="${name}"]]]`);
  }

  private getPanel(panelName: SurveyDataPanelEnum): Locator {
    return this.page.locator(`tab.active[role="tabpanel"] app-activity-data #${panelName})`);
  }
}
