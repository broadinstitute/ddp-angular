import { Locator, Page, expect } from '@playwright/test';
import { SurveyDataPanelEnum } from './enums/survey-data-enum';

export default class SurveyDataTab {
  constructor(private readonly page: Page) {
  }

  public async getInfo(panelName: SurveyDataPanelEnum, questionLabel: string): Promise<string> {
    const region = this.getPanel(panelName).locator('[role="region"]');
    const isVisible = await region.isVisible();
    if (!isVisible) {
      await this.getPanel(panelName).click();
      await expect(region).toBeVisible();
    }

    const body = region.locator('.mat-expansion-panel-body div').locator('xpath=')
  } 

  private getPanel(panelName: SurveyDataPanelEnum): Locator {
    return this.page.locator(`tab.active[role="tabpanel"] app-activity-data #${panelName})`);
  }
}
